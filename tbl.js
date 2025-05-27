function decodeHTMLEntities (str) {
    if(str && typeof str === 'string') {
      var element = document.createElement('div');
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
      element.innerHTML  = str;
      str = element.textContent;
      element.textContent = '';
    }

    return str;
}

function tbl(hrf, dv) {
  var that=this;
  this.tbl=($("#tbldv-"+hrf).attr("tbl") == undefined) ? $('<table id="tbldv-'+hrf+'" class="tbldv" tbl="'+hrf+'"><thead><tr><th>head1</th></tr></thead><tbody><tr><td>cell1_1</td></tr></tbody><tfoot><tr><td colspan="1"><div class="links" style="text-align: center;"></div></td></tr></tfoot></table>') : $("#tbldv-"+hrf);
    this.cntnr = dv?"."+dv:"body";  // sndoq almhtoa
    this.hdr=this.tbl.find("thead").eq(0); // anawin alhqol
    this.bdy=this.tbl.find("tbody").eq(0); // bianat aljdwal
    this.pgs=this.tbl.find("tfoot").eq(0); // arqam sfhat aljdwal
    this.arrfieldName=''; // trjmat alhqol
    this.cnedt=true; this.add=''; this.page=0; this.hdrs=''; this.hrf=hrf; this.form=''; this.total=0; this.rlst=''; this.pgsize=20;

this.init = function() {
  if(that.cnedt)that.add=$('<img src="images/icons/plus-black.png" style="float: right; cursor: pointer;" />').on("click",function(){ var edtform=$(that.form); var inpts=edtform.find("input:not(.button)"); $.each(inpts, function(k,x){ $(x).val(''); }); $(inpts[0]).val('0');$(inpts[1]).val('sv'); edtform.show(); });
  $(that.cntnr).empty().append(that.add).append('<br />').append(that.tbl); $(that.tbl).show();
  that.gtdata();
}

this.svdata = function(){
   var formData = $(that.form).find("form").eq(0).serialize();
   $.ajax({ type: "POST", url: "rd.php?p="+that.hrf, cache: false, data: formData, success: function(){ $(that.form).hide(); that.gtdata(); }
   });
   return false;
}

this.stdata = function(data) { that.bdy.empty();
    if(that.page==0){  var hdr='<tr>'; var i=0; that.rlst=data.lst; that.total=data.total; that.pgsize=data.per; that.hid=data.hid; that.form=$(decodeHTMLEntities(data.edtform)); $(that.cntnr).append(that.form); that.arrfieldName=data.arrfieldName; $.each(data.arrfieldName, function(key,field){ hdr +='<th name="'+key+'">' + field + '</th>'; i += 1; }); if(that.cnedt)hdr +='<th name="cmnd">&nbsp;-&nbsp;</th></tr>';
    that.hdr.html(hdr);that.hdr.find(that.hid).hide(); i = that.hdr.find("th:visible").length;
    var k = data.total>that.pgsize?parseInt((data.total / that.pgsize), 10):1;
      hdr = '<tr><td colspan="'+i+'"><div id="pagination" class="links" style="text-align: center;">';

    /* if(k>2){hdr += '<a href="javascript:void(0);">&laquo;</a>';for (i = 1; i < k; i++) { hdr += '&nbsp;<a href="javascript:void(0);">'+i+'</a>'; }hdr += '&nbsp;<a href="javascript:void(0);">&raquo;</a>';} */
    hdr += '</div></td></tr>'; that.pgs.empty().html(hdr); Pagination.Init(document.getElementById('pagination'), {size: k, page: 1, step: 3});
    if(k>2) that.pgs.bind("click", "a", function(event){ that.page=Pagination.page; that.gtdata();  });
    $(that.form).find("#sbmt").removeAttr("onclick").on("click", function(){ that.svdata(); return false; });
    that.bdy.on("click", "[fn]", function(event){ if($(event.target).attr("fn")=='edt'){ var edtform=$(that.form); var td=[]; var inpts=edtform.find("input:not(.button)"); var tds=$(event.target).parents("tr");
   td["id"]=tds.attr("eid"); td["a"]="updt"; tds=tds.find("td"); $.each(tds, function(n,v){ td[$(v).attr("name")]= $(v).text(); }); $.each(inpts, function(k,x){ $(x).val(td[$(x).attr("name")]); }); edtform.show(); }   });
    }

     var i=0;
    $.each(data.data, function(key,field){
      var rw = '<tr eid="'+field["id"]+'">'; i +=1; field["id"]=i;
    $.each(field, function(n,v){ v = v!==null?v:'';
    rw += '<td name="'+n+'" vl="'+v+'">' + (that.rlst[n]!==undefined && v!==''?that.rlst[n][v]:v) + '</td>';
    });
    if(that.cnedt)rw += '<td width="80" align="center"><img src="images/icons/edit-black.png" class="tdedt" fn="edt" alt="edt" onmouseover="this.src=\'images/icons/edit-white.png\';" onmouseout="this.src=\'images/icons/edit-black.png\';" /> &nbsp;&nbsp;&nbsp; <img src="images/icons/delete-black.png" class="tddl" alt="delete" fn="del" onmouseover="this.src=\'images/icons/delete-white.png\';" onmouseout="this.src=\'images/icons/delete-black.png\';" /></td></tr>';
    that.bdy.append(rw);
    });
    that.bdy.find(that.hid).hide();
}


this.gtdata = function(){
  that.bdy.append('<div id="loader"></div>');
  $.ajax({url: "rd.php?p="+that.hrf+"&s="+that.page, cache: false, type: "get", dataType: "json", success: function(data){that.stdata(data)} });
}

//this.init();

}