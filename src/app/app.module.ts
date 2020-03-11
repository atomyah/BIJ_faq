import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';  // npm install firebase @angular/fireで追加
import { AngularFirestoreModule } from '@angular/fire/firestore'; // npm install firebase @angular/fireで追加
import { AngularFireAuthModule } from '@angular/fire/auth'; // npm install firebase @angular/fireで追加
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; //npm i --save bootstrap, npm i --save @ng-bootstrap/ng-bootstrap
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout'; //Flex-layout用モジュール
import { NgAisModule } from 'angular-instantsearch'; //algolia instant search
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { FirebaseUIModule, firebase, firebaseui } from 'firebaseui-angular'; // 追加.FirebaseUIのモジュール
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//Material2モジュールのインポート
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule, } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';


// 作成したコンポーネント・モジュールのインポート
import { AppComponent } from './app.component';
import { FaqforumComponent } from './faqforum/faqforum.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { EditComponent } from './faqforum/admin/edit/edit.component';
import { ReplyComponent } from './faqforum/admin/reply/reply.component';
import { AdminComponent } from './faqforum/admin/admin.component';
import { AdminGuard } from  './faqforum/admin/admin.guard'; 


const appRoutes: Routes = [
  {
    path: 'faqforum',component: FaqforumComponent,
  },
  {
    path: '',component: HomeComponent
  },
  {
    path: 'login',component: LoginComponent
  },
  {
    path: 'admin',component: AdminComponent, canActivate: [AdminGuard]
  },
];

// FirebaseUI初期化コード
const firebaseUiAuthConfig: firebaseui.auth.Config = {
  autoUpgradeAnonymousUsers: false, // 匿名認証ユーザー自動アップグレード
  signInFlow: 'popup', // redirect or popup
  signInOptions: [
  // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  /*  
    {
      scopes: [
        'public_profile',
        'email',
        'user_likes',
        'user_friends'
      ],
      customParameters: {
        'auth_type': 'reauthenticate'
      },
      provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID
    },
  */

  //  firebase.auth.TwitterAuthProvider.PROVIDER_ID,
  //  firebase.auth.GithubAuthProvider.PROVIDER_ID,
  // {
  //    requireDisplayName: false,
  //    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
  // },

  //  firebase.auth.PhoneAuthProvider.PROVIDER_ID,
  　firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
  ],

  /*
  tosUrl: 'http://localhost:6200/TOS', // 'Team Of Serviceのリンク先URL'
  privacyPolicyUrl: 'プライバシーポリシーのURL',
  signInSuccessUrl: 'http://localhost:6200/home',
  credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM,
  siteName: 'benzoinfojapan', 
  */

};

@NgModule({
  declarations: [
    AppComponent,
    FaqforumComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    EditComponent,
    ReplyComponent,
    AdminComponent,
  ],
  imports: [
    RouterModule,
    RouterModule.forRoot(appRoutes),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule, //bootstrap5
    MatBadgeModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSliderModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatSelectModule,
    MatTableModule,
    FlexLayoutModule,
    //Firebaseの定義
    AngularFireModule.initializeApp(environment.firebase), // 追加
    AngularFirestoreModule,  // 追加.Firestore用モジュール
    AngularFireAuthModule,    // 追加.angularfireのAuth用モジュール
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),　// FirebaseUI用のモジュール
    FormsModule,
    ReactiveFormsModule,
    NgAisModule.forRoot(),
    BrowserModule,
    NgxPageScrollModule, //npm install ngx-page-scroll --save
    NgxPageScrollCoreModule, //npm install ngx-page-scroll-core --save
  ],
  providers: [],
  // MatDialogに必要な記述
  entryComponents: [EditComponent,ReplyComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
