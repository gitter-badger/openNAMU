var wiki = require('../wiki');
module.exports = function(n, ba){
  var six = n;
  var today = getNow();
  var d = require('debug')('openNAMU:parser');
  var docnames = Object.keys(wiki.doc);

  function getNow() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; 
  var yyyy = today.getFullYear();
  if(dd<10) {
      dd='0'+dd;
  }
  if(mm<10) {
      mm='0'+mm;
  }
  return yyyy+'/' + mm+'/'+dd;
  }
  
  six = six.replace(/<script>|<\/script>/g, "");
  six = six.replace(/<(.*) on(.*)="(.*)">/g, "");
  six = six.replace(/javascript:/g, "");
  
  six = six.replace(/^#redirect ([^\n]*)/g, "<head><meta http-equiv=\"refresh\" content=\"3;url=/w/$1\" /></head><li>3초 후 [[$1]] 문서로 리다이렉트 합니다.</li>");
  six = six.replace(/^#넘겨주기 ([^\n]*)/g, "<head><meta http-equiv=\"refresh\" content=\"3;url=/w/$1\" /></head><li>3초 후 [[$1]] 문서로 리다이렉트 합니다.</li>");
  
  var ohhhh = /\n>\s?(([^\n]*)((\n*(.*))+))/;
  var read
  while(true)
  {
	  if(read = ohhhh.exec(six))
	  {
		read[1] = read[1].replace(/\n>\s?/, "\n");
		six = six.replace(/\n>\s?(([^\n]*)((\n*(.*))+))/, "<blockquote>" + read[1] + "</blockquote>");
	  }
	  else
	  {
		  break;
	  }
  }
  
  
  six = six.replace(/##\s?([^\n]*)/g, "<!--$1-->");
  
  six = six.replace(/\[\[분류:([^\]\]]*)\]\]/g, "");
  
  six = six.replace(/\[\[((https?:\/\/)([^\]\]]*)\.(png|jpg|gif|jpeg))\|(.*)\]\]/g, "<a class=\"out_link\" href=\"$1asdf\"><span class=\"contect\">外</span>$5</a>");
  six = six.replace(/\[\[((https?:\/\/)([^\]\]]*)\.(png|jpg|gif|jpeg))\]\]/g, "<a class=\"out_link\" href=\"$1asdf\"><span class=\"contect\">外</span>$1asdf</a>");
  
  var docLinkPattern_Labeled = /\[\[([^\]\]]*)\|([^\]\]]*)\]\]/g,
    docLinkPattern = /\[\[([^\]\]]*)\]\]/g;
  six = six.replace(/\[\[(https?:\/\/)([^\]\]]*)\|([^\]\]]*)\]\]/g, "<a class=\"out_link\" href=\"$1$2\"><span class=\"contect\">外</span>$3</a>");
  six = six.replace(/\[\[(https?:\/\/)([^\]\]]*)\]\]/g, "<a class=\"out_link\" href=\"$1$2\"><span class=\"contect\">外</span>$1$2</a>");
  while(true) {
    var match = docLinkPattern_Labeled.exec(six);
    if(match == null)
        break;
    if(docnames.indexOf(match[1]) != -1) {
        // 존재하는 문서
        six = six.replace(match[0], '<a href="/w/' + match[1] + '">' + match[2] + '</a>');
    } else {
        // 안 존재하는 문서
        six = six.replace(match[0], '<a class="not_thing" href="/w/' + match[1] + '">' + match[2] + '</a>');
    }
  }
  while(true) {
    var match = docLinkPattern.exec(six);
    if(match == null)
        break;
    if(docnames.indexOf(match[1]) != -1) {
        // 존재하는 문서
        six = six.replace(match[0], '<a href="/w/' + match[1] + '">' + match[1] + '</a>');
    } else {
        // 안 존재하는 문서
        six = six.replace(match[0], '<a class="not_thing" href="/w/' + match[1] + '">' + match[1] + '</a>');
    }
  }
  
  var h0 = /======\s([^======]*)\s======\r\n/;
  var h1 = /=====\s([^=====]*)\s=====\r\n/;
  var h2 = /====\s([^====]*)\s====\r\n/;
  var h3 = /===\s([^===]*)\s===\r\n/;
  var h4 = /==\s([^==]*)\s==\r\n/;
  var h5 = /=\s([^=]*)\s=\r\n/;
  var h0c = 0;
  var h1c = 0;
  var h2c = 0;
  var h3c = 0;
  var h4c = 0;
  var h5c = 0;
  var head;
  var toc;
  var rtoc = '<div id="toc"><span id="toc-name">목차</span><br><br>';
  while(true) {
	  if(head = h5.exec(six)) {
		  h0c = h0c + 1;
		  toc = h0c + '.' + h1c + '.' + h2c + '.' + h3c + '.' + h4c + '.' + h5c + '.';
	      toc = toc.replace(/0./g, '');
	      toc = toc.replace(/.0/g, '');
		  rtoc = rtoc + '<a href="#s-' + toc + '">' + toc + '</a>. ' + head[1] + '<br>';
		  six = six.replace(/=\s([^=]*)\s=\r\n/, '<h1><a href="#toc" id="s-' + toc + '">' + toc + '.</a> $1</h1>\n');
	  } else if(head = h4.exec(six)) {
		  h1c = h1c + 1;
		  toc = h0c + '.' + h1c + '.' + h2c + '.' + h3c + '.' + h4c + '.' + h5c;
	      toc = toc.replace(/0./g, '');
	      toc = toc.replace(/.0/g, '');
		  rtoc = rtoc + '<a href="#s-' + toc + '">' + toc + '</a>. ' + head[1] + '<br>';
		  six = six.replace(/==\s([^==]*)\s==\r\n/, '<h2><a href="#toc" id="s-' + toc + '">' + toc + '.</a> $1</h2>\n');
	  } else if(head = h3.exec(six)) {
		  h2c = h2c + 1;
		  toc = h0c + '.' + h1c + '.' + h2c + '.' + h3c + '.' + h4c + '.' + h5c;
	      toc = toc.replace(/0./g, '');
	      toc = toc.replace(/.0/g, '');
		  rtoc = rtoc + '<a href="#s-' + toc + '">' + toc + '</a>. ' + head[1] + '<br>';
		  six = six.replace(/===\s([^===]*)\s===\r\n/, '<h3><a href="#toc" id="s-' + toc + '">' + toc + '.</a> $1</h3>\n');
	  } else if(head = h2.exec(six)) {
		  h3c = h3c + 1;
		  toc = h0c + '.' + h1c + '.' + h2c + '.' + h3c + '.' + h4c + '.' + h5c;
	      toc = toc.replace(/0./g, '');
	      toc = toc.replace(/.0/g, '');
		  rtoc = rtoc + '<a href="#s-' + toc + '">' + toc + '</a>. ' + head[1] + '<br>';
		  six = six.replace(/====\s([^====]*)\s====\r\n/, '<h4><a href="#toc" id="s-' + toc + '">' + toc + '.</a> $1</h4>\n');
	  } else if(head = h1.exec(six)) {  
		  h4c = h4c + 1;
		  toc = h0c + '.' + h1c + '.' + h2c + '.' + h3c + '.' + h4c + '.' + h5c;
	      toc = toc.replace(/0./g, '');
	      toc = toc.replace(/.0/g, '');
		  rtoc = rtoc + '<a href="#s-' + toc + '">' + toc + '</a>. ' + head[1] + '<br>';
		  six = six.replace(/=====\s([^=====]*)\s=====\r\n/, '<h5><a href="#toc" id="s-' + toc + '">' + toc + '.</a> $1</h5>\n');
	  } else if(head = h0.exec(six)) {
		  h5c = h5c + 1;
		  toc = h0c + '.' + h1c + '.' + h2c + '.' + h3c + '.' + h4c + '.' + h5c;
	      toc = toc.replace(/0./g, '');
	      toc = toc.replace(/.0/g, '');
		  rtoc = rtoc + '<a href="#s-' + toc + '">' + toc + '</a>. ' + head[1] + '<br>';
		  six = six.replace(/======\s([^======]*)\s======\r\n/, '<h6><a href="#toc" id="s-' + toc + '">' + toc + '.</a> $1</h6>\n');
	  } else {
		  rtoc = rtoc + '</div>';
		  break;
	  }
  }
  
  six = six.replace(/\[목차\]/g, rtoc);
  
  six = six.replace(/<!--\s?([^--]*)\s?-->/g, "<not_del>$1</not_del>");
  
  six = six.replace(/'''(.+?)'''(?!')/g,'<strong>$1</strong>');
  six = six.replace(/''(.+?)''(?!')/g,'<i>$1</i>');
  six = six.replace(/~~(.+?)~~(?!~)/g,'<s>$1</s>');
  six = six.replace(/--(.+?)--(?!-)/g,'<s>$1</s>');
  six = six.replace(/__(.+?)__(?!_)/g,'<u>$1</u>');
  six = six.replace(/\^\^(.+?)\^\^(?!\^)/g,'<sup>$1</sup>');
  six = six.replace(/,,(.+?),,(?!,)/g,'<sub>$1</sub>');
  
  six = six.replace(/{{{\+([1-5])\s?((([^}}}]*)*(\n)?)+)}}}(?!})/g,'<span class="font-size-$1">$2</span>');
  six = six.replace(/{{{\-([1-5])\s?((([^}}}]*)*(\n)?)+)}}}(?!})/g,'<span class="font-size-small-$1">$2</span>');
  
  six = six.replace(/{{{(#[0-9a-f-A-F]{3}) +(.*?)}}}(?!})/g,'<span style="color:$1">$2</span>');
  six = six.replace(/{{{(#[0-9a-f-A-F]{6}) +(.*?)}}}(?!})/g,'<span style="color:$1">$2</span>');
  six = six.replace(/{{{#(\w+) +(.*?)}}}(?!})/g,'<span style="color:$1">$2</span>');
  
  six = six.replace(/\[br\]/ig,'<br>');
  
  six = six.replace(/{{\|([^\|}}]*)\|}}/g, "<table><tbody><tr><td>$1</td></tr></tbody></table>");
  
  six = six.replace(/\.pngasdf/g, ".peg");
  six = six.replace(/\.gifasdf/g, ".gef");
  six = six.replace(/\.jpgasdf/g, ".jeg");
  six = six.replace(/\.jpegasdf/g, ".jepg");
  
  six = six.replace(/([^\n]*\.(jpeg|jpg|gif|png))\?width=([^\n]*)&height=([^\n]*)/g, "<img src=\"$1\" width=\"$3\"  height=\"$4\">");
  six = six.replace(/([^\n]*\.(jpeg|jpg|gif|png))\?height=([^\n]*)&width=([^\n]*)/g, "<img src=\"$1\" width=\"$3\" height=\"$4\">");
  six = six.replace(/([^\n]*\.(jpeg|jpg|gif|png))\?height=([^\n]*)/g, "<img src=\"$1\" height=\"$3\">");
  six = six.replace(/([^\n]*\.(jpeg|jpg|gif|png))\?width=([^\n]*)/g, "<img src=\"$1\" width=\"$3\">");
  six = six.replace(/([^\n]*\.(jpeg|jpg|gif|png))/g, "<img src=\"$1\">");
  six = six.replace(/<img src="<img src="([^\n]*\.(jpeg|jpg|gif|png))">" width="([^\n]*)" height="([^\n]*)">/g, "<img src=\"$1\" width=\"$3\" height=\"$4\">");
  six = six.replace(/<img src="<img src="([^\n]*\.(jpeg|jpg|gif|png))">" width="([^\n]*)">/g, "<img src=\"$1\" width=\"$3\">");
  six = six.replace(/<img src="<img src="([^\n]*\.(jpeg|jpg|gif|png))">" height="([^\n]*)">/g, "<img src=\"$1\" height=\"$3\">");
  
  six = six.replace(/\[youtube\(([^,]*),\s?width=(.*),\s?height=(.*)\)]/g, "<iframe width=\"$2\" height=\"$3\" src=\"https:\/\/www.youtube.com\/embed\/$1\" frameborder=\"0\" allowfullscreen><\/iframe>");
  six = six.replace(/\[youtube\(([^,]*),\s?height=(.*),\s?width=(.*)\)]/g, "<iframe width=\"$3\" height=\"$2\" src=\"https:\/\/www.youtube.com\/embed\/$1\" frameborder=\"0\" allowfullscreen><\/iframe>");
  six = six.replace(/\[youtube\(([^,]*),\s?width=(.*)\)]/g, "<iframe width=\"$2\" src=\"https:\/\/www.youtube.com\/embed\/$1\" frameborder=\"0\" allowfullscreen><\/iframe>");
  six = six.replace(/\[youtube\(([^,]*),\s?height=(.*)\)]/g, "<iframe height=\"$3\" src=\"https:\/\/www.youtube.com\/embed\/$1\" frameborder=\"0\" allowfullscreen><\/iframe>");
  six = six.replace(/\[youtube\((.*)\)]/g, "<iframe width=\"640px\" height=\"360px\" src=\"https://www.youtube.com/embed/$1\" frameborder=\"0\" allowfullscreen></iframe>");
  
  six = six.replace(/\[date]/g, today);
  six = six.replace(/\[datetime]/g, today);
  
  six = six.replace(/\[anchor\(([^\[\]]*)\)\]/g, "<div id=\"$1\"></div>");
  
  six = six.replace(/\s\*\s([^\n]*)\n/g, "<li>$1</li><not_br></not_br>");
  six = six.replace(/\s\*\s([^\n]*)/g, "<li>$1</li>");
  
  six = six.replace(/-{4,11}/g, "<hr>");
  
  var a = 1;
  var b = /\[\*\s((?:[^\[\]]+)*)\]/;
  var tou = "<br>";
  
  while(true)
  {
	  match = b.exec(six);
	  if(match == null)
	  {
		  break;
	  }
	  else
	  {
		tou = tou + "<a href=\"#rfn-" + a + "\" id=\"fn-" + a + "\">[" + a + "]</a> " + match[1] + "<br>";
		six = six.replace(/\[\*\s((?:[^\[\]]+)*)\]/, "<sup><a href=\"#fn-" + a + "\" id=\"rfn-" + a + "\">[" + a + "]</a></sup>");
		a = a + 1;
	  }
  }
  
  six = six.replace(/<math>(((?!<math>).)*)<\/math>/g, "<img src=\"https:\/\/latex.codecogs.com/gif.latex?$1\" title=\"$1\" />")
  
  six = six.replace(/{{{#!html/g, "")
  six = six.replace(/}}}/g, "")
  
  six = six.replace(/\.peg/g, ".png")
  six = six.replace(/\.gef/g, ".gif")
  six = six.replace(/\.jeg/g, ".jpg")
  six = six.replace(/\.jepg/g, ".jpeg")
  
  six = six.replace(/\|\|(<table\s?((width|height)=([^>]*))>)?(<table\s?((width|height)=([^>]*))>)?((\s?)*(([^||]*)*(\|\|)*(\s?))*)\|\|((((\n\|\|)*((\s?)*(([^||]*)*(\|\|)*(\s?))*))+)\|\|)?/g, '<table $2 $6><tbody><tr><td>$9</td></tr></tbody></table>');
  six = six.replace(/\|\|\r\n\|\|/g, "</td></tr><not_br></not_br><tr><td>");
  six = six.replace(/\|\|/g, "</td><td>");
  six = six.replace(/<td>(<-([^>]*)>)?<:>/g, "<td style=\"text-align: center;\">$1");
  six = six.replace(/(<td\s?([^>]*)?)><-([1-9]*)>/g, "$1 colspan=\"$3\">");
  
  six = six.replace(/\n/g, "<br>");
  six = six.replace(/<not_br><\/not_br>/g, "\n");
  
  six = six.replace(/\[각주\](((<br>+)*(\s+)*(\n+))+)?$/g, "");
  six = six.replace(/\[각주\]/g, "<br>" + tou);
  six = six + tou;
  d('1: '+six)

  ba(six)
  // 새 파서 테스트중 Beta 0.4 버전 //
  // Thank for 2DU, LiteHell //
}
function doNothing(a) {}
