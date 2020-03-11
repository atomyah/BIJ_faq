import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Meta} from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../common.scss','./home.component.scss']
})
export class HomeComponent implements OnInit {

  title: string;

  constructor(public route: Router,private meta: Meta) { 
    this.meta.updateTag({name: 'title', content: '質問フォーラム'})
    this.meta.updateTag({name: 'description',content: '薬機法違反になるため個人的な服薬指示・減薬指導にはお答えできません。事例やわたしのアイデアを紹介してもあくまで参考です。必ず自己責任で判断してください'})
    this.meta.updateTag({name: 'keywords', content: '減薬,断薬,ジアゼパム換算,置換,アルプラゾラム,ソラナックス,コンスタン,デパス,エチゾラム,リーゼ,クロチアゼパム,ジアゼパム,セルシン,ブロマゼパム,レキソタン,セニラン,ロフラゼプ酸エチル,メイラックス,ロラゼパム,ワイパックス,エスタゾラム,ユーロジン,クアゼパム,ドラール,ゾルピデム,マイスリー,ゾピクロン,アモバン,ニトラゼパム,ベンザリン,ネルボン,フルニトラゼパム,サイレース,ロヒプノール,ブロチゾラム,レンドルミン,ロルメタゼパム,エバミール,クロナゼパム,リボトリール,ランドセン,トフィソパム,グランダキシン,トリアゾラム,ハルシオン,クロキサゾラム,セパゾン,クロラゼプ酸,メンドン,クロルジアゼポキシド,コントール,バランス,タンドスピロン,セディール,フルジアゼパム,エリスパン,フルタゾラム,コレミナール,フルトプラゼパム,レスタス,メキサゾラム,メレックス,メダゼパム,レスミット,エスゾピクロン,ルネスタ,ニメタゼパム,エリミン,ハロキサゾラム,ソメリン,クアゼパム,ドラール,フルラゼパム,ダルメート,ベノジール,リルマザホン,リスミー,ロルメタゼパム,エバミール,ロラメット,クロバザム,マイスタン'})
    this.meta.updateTag({name: 'twitter:card', content: 'summary'})
    this.meta.updateTag({name: 'twitter:site', content: '@benzoinfojapan'})
    this.meta.updateTag({property: 'og:url', content: 'https://benzoinfojapan.org/forum'})
    this.meta.updateTag({property: 'og:title', content: '質問フォーラム'})
    this.meta.updateTag({property: 'og:description', content: '薬機法違反になるため個人的な服薬指示・減薬指導にはお答えできません。事例やわたしのアイデアを紹介してもあくまで参考です。必ず自己責任で判断してください'})
    this.meta.updateTag({property: 'og:image', content: 'https://benzoinfojapan.org/assets/images/flower-avatar.jpg'}) 
  }

  ngOnInit() {
    this.title = '質問フォーラム'
  }

  goFaqforum() {
    this.route.navigate(['/faqforum']);
  }
}
