import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Post } from '../../../class/faqpost';
import { FormBuilder,FormControl,FormGroup,Validators } from '@angular/forms';
import { formatDate } from '@angular/common'; // 現在日付獲得用

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.scss']
})
export class ReplyComponent implements OnInit {
  userName: string;
  message: string;
  parent_id: string; // 返信元記事No.
  uid: string = 'pIomaFBT4BPcVhAhcxYpHL3syfu1'; // 管理人のuid

  post: Post;
  posts: Post[];

          //フォームグループ作成
          commentForm = this.fb.group({
            userName:  ['', [
              Validators.required,
              Validators.maxLength(10)
            ]],
            message:  ['', [
              Validators.required,
              Validators.maxLength(3000)
            ]],
            parent_id:  [''],
          });
  
          
  constructor(
    private db: AngularFirestore,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ReplyComponent>,
    @Inject(LOCALE_ID) private locale: string, // 現在日付獲得用
    @Inject(MAT_DIALOG_DATA) public data: Post) { } // matDialogから受け取った投稿データオブジェクトを'data'として使う


  ngOnInit() {
    //formに初期値設定
    this.commentForm.patchValue({
      userName: '管理人',
      message: '＞' + this.data.userName + 'さん',
      parent_id: this.data.id, // parent_idの固定値として投稿オブジェクトdataのid値
    });
  }

  onNoClick() {           // これはたぶん余白をクリックしたときだな
    this.dialogRef.close();
  }

  onClickCloseButton() {
    this.dialogRef.close();
  }

  savePost() {
    let now = new Date();     // 現在日付
    let id = this.db.createId();
    console.warn(this.commentForm.value.userName); //「フォームグループ名.value.フォームコントロール名」で入力値を取ってこれる
    console.warn(this.commentForm.value.message);
    console.warn(this.commentForm.value.parent_id);
    console.log('■■■■■■' + this.commentForm.value.userName + ' と ' + this.commentForm.value.message + ' と　' + this.commentForm.value.parent_id);
    this.post = {
      id: id,
      userName: this.commentForm.value.userName,
      message: this.commentForm.value.message,
      created: formatDate(now,"yyyy/MM/dd HH:mm", this.locale), // 現在日付をフォーマットしてcreatedに
      uid: this.uid,                                            // 取ってきたuidをそのままデータベースのuidフィールドに
      parent_id: this.commentForm.value.parent_id,
    };
    
    this.db
      .collection('commentsfaqs').doc(id).set(this.post)
      .catch(async error => {
        console.log('■■■エラー'+ error.toString())
    })
    .then(async log => {
      alert('■■■返信投稿完了■■■')
    })
    this.commentForm.reset();
  }

}
