import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Post } from '../../../class/faqpost';
import { FormBuilder,FormControl,FormGroup,Validators } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  userName: string;
  message: string;
  post: Post;
  posts: Post[];
  postsCollection: AngularFirestoreCollection<Post>;

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
        });

  constructor(    
    private db: AngularFirestore,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Post) { }

  ngOnInit() {
  }

  onNoClick() {           // これはたぶん余白をクリックしたときだな
    this.dialogRef.close();
  }

  onClickCloseButton() {
    this.dialogRef.close();
  }

  updatePost(post:Post) {
    this.db
    .collection('commentsfaqs')
    .doc(post.id)    
    .update({userName: this.commentForm.value.userName, message: this.commentForm.value.message})  
    .then(async => {
      alert('コメントを更新した');         
      })
    .catch(async error => {
      console.log('■■■エラー'+ error.toString())
    })
  }

}
