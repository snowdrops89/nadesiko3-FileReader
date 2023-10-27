/*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*
　nadesiko3-FileReader.js　v1.1.0

　File APIで、ローカルのファイルを読み込むためのプラグイン。

　作者:雪乃☆雫　／　ライセンス:CC0　／　制作時のナデシコバージョン:3.4.22
*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*/
const PluginFileReader = {
  '初期化': {
    type: 'func',
    josi: [],
    pure: true,
    fn: function (sys) {
      sys.__stop_list = [];
      sys.__inp_list = [];
      sys.__dom_list = [];
    }
  },
  // @ファイル選択作成
  'ファイル選択作成': { // @ファイル選択(input[type='file'])を作成しDOMオブジェクトを返す // @ふぁいるせんたくさくせい
    type: 'func',
    josi: [],
    pure: false,
    fn: function (sys) {
      const inp = sys.__exec('DOM部品作成', ['input', sys])
      inp.type = 'file'
      return inp
    }
  },
  'ファイル選択時': { // @inputでファイルを選択した時 // @ふぁいるせんたくしたとき
    type: 'func',
    josi: [['と'],['の', 'で']],
    fn: function (fn, inp, sys) {
      if (typeof (inp) === 'string') {inp = document.querySelector(inp)}
      sys.__inp_list.push({inp,fn})
      sys.__file_change = function(e){
        sys.__v0['対象'] = inp.files
        sys.__v0['対象イベント'] = e
        return fn(e, sys);
      };
      inp.removeEventListener('change', sys.__file_change);
      inp.addEventListener('change', sys.__file_change);
    }
  },
  // @ドラッグ&ドロップ
  'ファイルドロップ時': { // @DOMにファイルをドロップした時 // @ふぁいるどろっぷしたとき
    type: 'func',
    josi: [['と'],['に', 'へ']],
    fn: function (fn, dom, sys) {
      if (typeof (dom) === 'string') {dom = document.querySelector(dom)}
      sys.__dom_list.push({dom,fn})
      sys.__dom_dragenter = function(e){
        e.stopPropagation();
        e.preventDefault();
      };
      sys.__dom_dragover = function(e){
        e.stopPropagation();
        e.preventDefault();
      };
      sys.__dom_drop = function(e){
        e.stopPropagation();
        e.preventDefault();
        const dt = e.dataTransfer;
        sys.__v0['対象'] = dt.files
        sys.__v0['対象イベント'] = e
        return fn(e, sys);
      };
      //同じのがあれば消す
      dom.removeEventListener('dragenter', sys.__dom_dragenter);
      dom.removeEventListener('dragover', sys.__dom_dragover);
      dom.removeEventListener('drop', sys.__dom_drop);
      //イベント追加する
      dom.addEventListener('dragenter', sys.__dom_dragenter);
      dom.addEventListener('dragover', sys.__dom_dragover);
      dom.addEventListener('drop', sys.__dom_drop);
    }
  },
  'ドロップ禁止': { // @DOMへのファイルドロップ操作を無効にする // @どろっぷきんし
    type: 'func',
    josi: [['に', 'へ']],
    fn: function (dom, sys) {
      if (typeof (dom) === 'string') {dom = document.querySelector(dom)}
      sys.__stop_list.push(dom)
      sys.__stop_dragover = function(e){
           e.preventDefault();
      };
      sys.__stop_drop = function(e){
           e.preventDefault();
           e.stopPropagation();
      };
      dom.addEventListener('dragover', sys.__stop_dragover, false);
      dom.addEventListener('drop', sys.__stop_drop, false);
    }
  },
  // @ファイル開く
  'テキストファイル追加拡張子': { type: 'const', value: 'csv|tsv|json|js|nako|nako3' }, // @てきすとふぁいるついかかくちょうし
  'テキストファイル開時': { // @ローカルのテキストファイルを開く // @てきすとふぁいるひらいたとき
    type: 'func',
    josi: [['と'],['で'],['の', 'を']],
    fn: function (fn, cha, file, sys) {
      if (!file.type.match('text.*')&& !file.name.match('.+\.('+ sys.__v0['テキストファイル追加拡張子'] +')')) {
        console.error("テキストファイル開時：『"+file.name+"』は、テキストファイルではありません。");
        return;
      }
      const reader = new FileReader();
      reader.readAsText(file, cha);
      reader.onload = function() {
        txt = reader.result
        sys.__v0['対象'] = txt
        return fn(txt, sys);
      }
    }
  },
  '画像ファイル開時': { // @ローカルの画像ファイルを開く // @がぞうふぁいるひらいたとき
    type: 'func',
    josi: [['で'],['の', 'を']],
    fn: function (fn, file, sys) {
      if (!file.type.match('image.*')) {
        console.error("画像ファイル開時：『"+file.name+"』は、画像ファイルではありません。");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function() {
        const img = new window.Image()
        img.src = reader.result
        sys.__v0['対象'] = img
        img.onload = function() {
          return fn(img, sys);
        }
      }
    }
  },
  'オーディオファイル開時': { // @ローカルのオーディオファイルを開く // @おーでぃおふぁいるひらいたとき
    type: 'func',
    josi: [['で'],['の', 'を']],
    fn: function (fn, file, sys) {
      if (!file.type.match('audio.*')) {
        console.error("オーディオファイル開時：『"+file.name+"』は、オーディオファイルではありません。");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function() {
        const audio = new Audio()
        audio.pause()
        audio.src = reader.result;
        sys.__v0['対象'] = audio
        return fn(audio, sys);
      }
    }
  },
  'データファイル開時': { // @ローカルのデータファイルを開く // @でーたふぁいるひらいたとき
    type: 'func',
    josi: [['で'],['の', 'を']],
    fn: function (fn, file, sys) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function() {
        const data = reader.result;
        sys.__v0['対象'] = data
        return fn(data, sys);
      }
    }
  },
  '!クリア': {
    type: 'func',
    josi: [],
    pure: true,
    fn: function (sys) {
    //ドロップ禁止をクリアする
      for (let i = 0; i < sys.__stop_list.length; i++) {
        const dom = sys.__stop_list[i];
        dom.removeEventListener('dragover', sys.__stop_dragover, false);
        dom.removeEventListener('drop', sys.__stop_drop, false);
      };
      //ドラッグ＆ドロップをクリアする
      for (let i = 0; i < sys.__dom_list.length; i++) {
        const dom = sys.__dom_list[i]['dom'];
        const fn = sys.__dom_list[i]['dfn'];
        dom.removeEventListener('dragenter', sys.__dom_dragenter);
        dom.removeEventListener('dragover', sys.__dom_dragover);
        dom.removeEventListener('drop', sys.__dom_drop);
      };
      //ファイル選択時をクリアする
      for (let i = 0; i < sys.__inp_list.length; i++) {
        const inp = sys.__inp_list[i]['inp'];
        const fn = sys.__inp_list[i]['fn'];
        inp.removeEventListener('change', sys.__file_change);
      };
    }
  }
}
// なでしこ3の本体に関数を登録する
if (typeof (navigator) === 'object') {
  navigator.nako3.addPluginObject("PluginFileReader", PluginFileReader)
} else {
  module.exports = PluginFileReader
}
