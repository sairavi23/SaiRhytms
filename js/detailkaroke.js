function detailKarokeJson (json)
{
    var karokeHtml = "";
    karokeHtml += '<div>source: '+ json.source  +'</div>'
    karokeHtml += '<div><span>scale: '+ json.reference.scale  +'</span> <audio src="'+json.reference.url+'"></audio> </div>';
    return karokeHtml;
}