/* -------------------------------------------------------------------------*
 * 						GALLERY IMAGE PAGINATION							*
 * -------------------------------------------------------------------------*/
"use strict";

function gallery_pagination(page_num,max_num_pages) {
	if(page_num == ''){ page_num = '1'; }
	if(max_num_pages > 1 ){
					
		var adjacents = 2;
		var page = parseInt(page_num);
		var lastpage = parseInt(max_num_pages);
		var lpm1 = parseInt(lastpage - 1);	
		var pagination = "";
		var next = parseInt(page + 1);
		var prev = parseInt(page - 1);
		
			
		if(lastpage > 1)
		{
			//pages	
			if (lastpage < 7 + (adjacents * 2))	//not enough pages to bother breaking it up
			{	
				for (var counter = 1; counter <= lastpage; counter++)
				{
					if (counter == page)
						pagination+= '<a href="javascript:;" rel="'+counter+'" data-nr="'+counter+'" class="photo-num gal-thumbs">'+counter+'</a>';
					else
						pagination+= '<a href="javascript:;" rel="'+counter+'" data-nr="'+counter+'" class="photo-num gal-thumbs">'+counter+'</a>';					
				}
			}
			else if(lastpage > 5 + (adjacents * 2))	//enough pages to hide some
			{
			
				//close to beginning; only hide later pages
				if(page < 1 + (adjacents * 2))		
				{
					for (counter = 1; counter < 4 + (adjacents * 2); counter++)
					{
						if (counter == page)
							pagination+= '<a href="javascript:;" rel="'+counter+'" data-nr="'+counter+'" class="photo-num gal-thumbs">'+counter+'</a>';
						else
							pagination+= '<a href="javascript:;" rel="'+counter+'" data-nr="'+counter+'" class="photo-num gal-thumbs">'+counter+'</a>';				
					}
					pagination+= '<span class="photo-num">...</span>';
					pagination+= '<a href="javascript:;" rel="'+lpm1+'" data-nr="'+lpm1+'" class="photo-num gal-thumbs">'+lpm1+'</a>';
					pagination+= '<a href="javascript:;" rel="'+lastpage+'" data-nr="'+lastpage+'" class="photo-num gal-thumbs">'+lastpage+'</a>';		
				} 
				else if(lastpage - (adjacents * 2) > page && page > (adjacents * 2)) {

					pagination+= '<a href="javascript:;" rel="1" data-nr="1" class="photo-num gal-thumbs">1</a>';
					pagination+= '<a href="javascript:;" rel="2" data-nr="2" class="photo-num gal-thumbs">2</a>';
					pagination+= '<span class="photo-num">...</span>';

					for (counter=page-adjacents; counter <= page+adjacents; counter++)
					{
						if (counter == page)
							pagination+= '<a href="javascript:;" rel="'+counter+'" data-nr="'+counter+'" class="photo-num gal-thumbs">'+counter+'</a>';
						else
							pagination+= '<a href="javascript:;" rel="'+counter+'" data-nr="'+counter+'" class="photo-num gal-thumbs">'+counter+'</a>';				
					}
					pagination+= '<span class="photo-num">...</span>';
					pagination+= '<a href="javascript:;" rel="'+lpm1+'" data-nr="'+lpm1+'" class="photo-num gal-thumbs">'+lpm1+'</a>';
					pagination+= '<a href="javascript:;" rel="'+lastpage+'" data-nr="'+lastpage+'" class="photo-num gal-thumbs">'+lastpage+'</a>';	
				} else {
					pagination+= '<a href="javascript:;" rel="1" data-nr="1" class="photo-num gal-thumbs">1</a>';
					pagination+= '<a href="javascript:;" rel="2" data-nr="2" class="photo-num gal-thumbs">2</a>';
					pagination+= '<span class="photo-num">...</span>';
					for (counter = lastpage - (2 + (adjacents * 2)); counter <= lastpage; counter++)
					{
						if (counter == page)
							pagination+= '<a href="javascript:;" rel="'+counter+'" data-nr="'+counter+'" class="photo-num gal-thumbs">'+counter+'</a>';
						else
							pagination+= '<a href="javascript:;" rel="'+counter+'" data-nr="'+counter+'" class="photo-num gal-thumbs">'+counter+'</a>';					
					}
				}
			}



		}
		
		

	}

	jQuery('.photo-gallery-full .photo-num-count').html(pagination);
	jQuery.each(jQuery('.photo-gallery-full .photo-num-count'), function() {
		jQuery(this).removeClass("current");
		if(jQuery(this).attr("data-nr") == page_num) {
			jQuery(this).addClass("current");
		}

	});
}

var ot_page_num =  jQuery('.photo-gallery-full .ot-gallery-image').attr("data-id");
var ot_max_num_pages = jQuery('.photo-gallery-full .photo-num-count').data("total");

gallery_pagination(ot_page_num,ot_max_num_pages);

//show the loading after click
jQuery('.ot-slide-item').on( "click", ".next, .prev, .gal-thumbs", function() {
	ot_page_num =  jQuery(this).attr("rel");
	ot_max_num_pages = jQuery('.photo-gallery-full .photo-num-count').data("total");

	gallery_pagination(ot_page_num,ot_max_num_pages);
	
});


jQuery(document).ready(function(){
    jQuery(".visitors-vote").mousemove(function(e){
    	if( !jQuery(this).hasClass('voted') ) {

	        var Offset = jQuery(this).offset();
	        var relativeXPosition = (e.pageX - Offset.left);
			var _relativeXPosition = (relativeXPosition+0.5)*1.204819277108434;
			jQuery(this).children("span").css("width", _relativeXPosition+"%");
			jQuery(this).data("vote", _relativeXPosition);
			//jQuery.cookie('quadrum_vote_'+jQuery(this).data('id'), '1', { expires: 140, secure: true });
    	}
    }).mouseout(function(e){
    	if( !jQuery(this).hasClass('voted') ) {
    		jQuery(this).find("span").width(jQuery(this).data('before')+"%");
	        

	    }
    });


	jQuery('.visitors-vote').on( "click", function() {
		if( !jQuery(this).hasClass('voted') ) {
			var clicked = jQuery(this);
			if( clicked.data('dont') == 1 ) return;
			clicked.data('dont',1);
			var _relativeXPosition = clicked.data("vote");
			jQuery.ajax({
	            url: ot.adminUrl,
	            dataType: 'text',
	            data: {
	                'action':'quadrum_visitor_vote',
	                'nonce' : ot.security,
	                'vote' : _relativeXPosition,
	                'post_id' : clicked.data("id"),
	            },
	            success:function(results) { 
	            	console.log(results);
	                clicked.addClass("voted");
	                clicked.parent().parent().parent().find(".rev-score").html(results);
	                clicked.parent().parent().parent().find(".rating-total span").css("width", results*20+"%");
	            }
	        });
	        clicked.data('dont',false);
		}
	});
});


