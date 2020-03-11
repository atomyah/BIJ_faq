import { Component, OnInit, Inject, LOCALE_ID, ViewChild } from '@angular/core'; // Inject, LOCALE_IDは現在日付獲得用
import { Router } from '@angular/router';
import { Post } from '../class/faqpost';
import { Observable } from 'rxjs'; 
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseUISignInSuccessWithAuthResult, FirebaseUISignInFailure } from 'firebaseui-angular';
import * as firebase from 'firebase';
import { formatDate } from '@angular/common'; // 現在日付獲得用
import { map } from "rxjs/operators"; // 追加
import { environment } from 'src/environments/environment';
import { FormBuilder,FormControl,FormGroup,Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import algoliasearch from 'algoliasearch/lite';

@Component({
  selector: 'app-faqforum',
  templateUrl: './faqforum.component.html',
  styleUrls: ['../common.scss','./faqforum.component.scss']
})


export class FaqforumComponent implements OnInit {
  currentURL: string; 
  title: string;
  message: string;
  userName: string;
  uid: string;
  post: Post;
  posts: Observable<Post[]>;

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
  

  searchConfig = {              // Algolia APIキー設定
  //  ...environment.algolia
    indexName: 'prod_commentsfaqs',
    searchClient: algoliasearch(environment.algolia.appId, environment.algolia.apiKey)
  };

  postsCollection: AngularFirestoreCollection<Post>; // 書きこみ用Firestoreの準備

  user: Observable<firebase.User>; // uidを獲得するためにuserオブジェクト変数


  constructor(
    public route: Router,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    @Inject(LOCALE_ID) private locale: string, // 現在日付獲得用
    private fb: FormBuilder,
    public dialog: MatDialog,
  ) {
    this.title = '質問フォーラム'
          // uidを獲得するためにauthStateからsubscribeでuserのuidを取ってくる
    // 参考：https://stackoverflow.com/questions/45829611/safest-way-to-get-user-id-in-angularfire2
    this.user = this.afAuth.authState;
    this.afAuth.authState.subscribe(user => {
      if(user) {
        this.uid = user.uid;
      } else {
        // Empty the value when user signs out
        this.uid = null;
      }
    });
   }

  ngOnInit() {
    this.getPosts();
    console.log('◆◆◆' + this.uid)
  }


  getPosts() {
    this.postsCollection = this.db.collection<Post>(
      'commentsfaqs', ref => ref
        .orderBy('created', 'asc')
        );       

    this.posts = this.postsCollection.snapshotChanges().pipe
    (map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as Post;
        const id = action.payload.doc.id;
        const uid = action.payload.doc.data().uid;
        return { id,uid,  ...data };
        });
      }));
      console.log('subscribeしたものは、' + this.posts.subscribe() );
  }

  onSubmit() {
    console.warn(this.commentForm.value);
  }

  //リアクティブフォームで行う. https://angular.io/guide/reactive-forms
  savePost() {
    let now = new Date();     // 現在日付
    let id = this.db.createId();
    console.warn(this.commentForm.value.userName); //「フォームグループ名.value.フォームコントロール名」で入力値を取ってこれる
    console.warn(this.commentForm.value.message);
    console.log('■■■■■■' + this.commentForm.value.userName + ' と ' + this.commentForm.value.message);
    this.post = {
      id: id,
      userName: this.commentForm.value.userName,
      message: this.commentForm.value.message,
      created: formatDate(now,"yyyy/MM/dd HH:mm", this.locale), // 現在日付をフォーマットしてcreatedに
      uid: this.uid,                                            // 取ってきたuidをそのままデータベースのuidフィールドに
      parent_id: '',
    };
    
    this.db
      .collection('commentsfaqs').doc(id).set(this.post)
      .catch(async error => {
        console.log('■■■エラー'+ error.toString())
    })
    .then(async log => {
      alert('投稿完了。確認はページをリロードしてみてください。')
    })
    this.commentForm.reset();
  }



    // サインアウト
    async logout() {
      this.afAuth.auth.signOut();
    }

    // 成功時のコールバック
    successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
      console.log(signInSuccessData);
    }

    // 失敗時のコールバック
    async errorCallback(errorData: FirebaseUISignInFailure) {
      console.log(errorData);
    }

}
