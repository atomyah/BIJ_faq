import { Component, OnInit } from '@angular/core'; 
import { Router } from '@angular/router';
import { Post } from '../../class/faqpost';
import { Observable } from 'rxjs'; 
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseUISignInSuccessWithAuthResult, FirebaseUISignInFailure } from 'firebaseui-angular';
import * as firebase from 'firebase';
import { map } from "rxjs/operators"; // 追加
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { EditComponent } from './edit/edit.component';
import { ReplyComponent } from './reply/reply.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  currentURL: string; 
  title: string;
  message: string;
  userName: string;
  uid: string;
  post: Post;
  posts: Observable<Post[]>;

  postsCollection: AngularFirestoreCollection<Post>; // 書きこみ用Firestoreの準備

  user: Observable<firebase.User>; // uidを獲得するためにuserオブジェクト変数

  countCommentsURL : string = 'https://us-central1-bij-faq.cloudfunctions.net/countComments' // function 'countComments'のURL
  length: number; //ページネーションで使う全書き込み件数
  pageIndex: number = 0; //ページネーションで使うページインデックス初期値
  perPage: number = 10; //ページネーションで使うページ当たりのデータ数初期値
  lowValue: number = 0; //ページネーションのsliceで使うbegin値初期値
  highValue: number = 10;　//ページネーションのsliceで使うbegin+perPage値初期値

  constructor(
    public route: Router,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    public dialog: MatDialog,
    private httpClient: HttpClient,
  ) {
        this.title = '管理画面'
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
    this.getDataSize();
    this.getPosts();
    console.log('◆◆◆' + this.uid)
  }

  /* ページネーションに使用する変数と関数 */
  // Firestoreの全データ件数を獲得しlengthに保存
  async getDataSize() {
    /* 古いやり方
  this.db.collection('commentsfaqs').valueChanges().subscribe( values => {
    console.log('■データ数は、' + values.length);
    this.length = values.length;
  })
    */
   this.httpClient.get(this.countCommentsURL)
    .toPromise()
    .then((res) => {
      const response: any = res;
      console.log('responseは、' + response);
      console.log('lesponse.lengthは、' + response.length);
      this.length = response.length
    })
    .catch((error) =>
      console.log(error)
    );
  }

  
  // MatPaginator UI初期値（33行目より）
    /*  
    length = this.length;
    pageIndex: number = 0; //ページネーションで使うページインデックス初期値
    perPage: number = 50; //ページネーションで使うページ当たりのデータ数初期値
    lowValue: number = 0; //ページネーションのsliceで使うbegin値初期値
    highValue: number = 50;　//ページネーションのsliceで使うbegin+perPage値初期値
    */

  // MatPaginatorイベントをオブジェクト化
  pageEvent: MatPaginator;

  // Paginatorからのイベント発火関数
    public getPaginatorData(event) {
      this.lowValue = event.pageIndex * event.pageSize;
      this.highValue = this.lowValue + event.pageSize;
      return event;
    }
/* ページネーションに使用する変数と関数 ~ここまで */

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

    // サインアウト
    async logout() {
      this.afAuth.auth.signOut();
    }

    // 成功時のコールバック
    async successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
      console.log(signInSuccessData);
    }

    // 失敗時のコールバック
    async errorCallback(errorData: FirebaseUISignInFailure) {
      console.log(errorData);
    }

      // Mat-Dialogでedit.component（編集用モーダル）を開く
  openDialogE(post: Post) {
    this.dialog.open(EditComponent, {
      width: '900px',
      data: post,
      disableClose: false
    });
  }

    // Mat-Dialogでreply.component（返信用モーダル）を開く
  openDialogR(post: Post) {
    this.dialog.open(ReplyComponent, {
      width: '900px',
      data: post,
      disableClose: false
    });
  }

  deletePost(post: Post) {
    if (confirm(post.id + "を消しちゃうよ～?")) {
    this.postsCollection
      .doc(post.id)
      .delete()
      .then(async() => {
        alert('削除完了!')
      })
    }
  }
}
