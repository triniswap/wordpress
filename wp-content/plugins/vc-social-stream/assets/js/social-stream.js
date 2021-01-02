if (typeof Object.create !== 'function') {
    Object.create = function(obj) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}
function svc_megnific_script_with_content(){
	jQuery('a.svc_big_img,.popup-youtube,.popup-vimeo').magnificPopup({
          type: 'ajax',
		  closeBtnInside:false,
		  closeOnBgClick: false
	});
	jQuery('a.svc_gplus_img').magnificPopup({
	  type: 'image',
	  closeBtnInside:false
	});	
}
function svc_megnific_script(){
	jQuery('a.svc_big_img,a.svc_gplus_img').magnificPopup({
	  type: 'image',
	  closeBtnInside:false
	});
	jQuery('.popup-youtube').magnificPopup({
	  type: 'iframe',
	  mainClass: 'mfp-fade',
	  preloader: false,
	  closeBtnInside:false,
	  iframe: {
		 patterns: {
		   youtube: {
			index: 'youtube.com', 
			id: 'v=', 
			src: '//www.youtube.com/embed/%id%?rel=0&autoplay=0'
		   }
		 }
	   }
	});
	jQuery('.popup-vimeo').magnificPopup({
	  type: 'iframe',
	  mainClass: 'mfp-fade',
	  preloader: false,
	  closeBtnInside:false,
	  iframe: {
		 patterns: {
		   vimeo: {
			index: 'vimeo.com', 
			id: '/',
			src: '//player.vimeo.com/video/%id%?autoplay=0'
		   }
		 }
	   }
	});
}
var sv = 0;
var si = 0;
var social_dataa = '';
(function($, window, document, undefined) {
    $.fn.svc_social_stream = function(_options) {
        var defaults = {
            plugin_folder: '', // a folder in which the plugin is located (with a slash in the end)
            template: 'template.html', // a path to the template file
            show_media: false, // show images of attachments if available
            media_min_width: 300,
            length: 150, // maximum length of post message shown
			effect:'',
            insta_access_token:'2255098913.1677ed0.67fe3a5539e94e58ba7cbe864d233d97',
			grid_columns_count_for_desktop:'',
			grid_columns_count_for_tablet:'',
			grid_columns_count_for_mobile:'',
			popup:'',
			stream_id:''
        };
        moment.locale('en');
        console.log(svc_ajax_url.laungage);
        moment.locale(svc_ajax_url.laungage);
        //---------------------------------------------------------------------------------
        var options = $.extend(defaults, _options),
            container = $(this),
            template,
            social_networks = ['facebook', 'instagram', 'vk', 'google', 'blogspot', 'twitter', 'tumblr', 'youtube','vimeo','dribbble'];
        //---------------------------------------------------------------------------------
        //---------------------------------------------------------------------------------
        // This function performs consequent data loading from all of the sources by calling corresponding functions
        function fireCallback(dataa_social) {
            var fire = true;
            if (fire && options.callback) {
                options.callback(dataa_social);
				social_dataa = '';
				/*if(options.popup == 'p1'){
					svc_megnific_script();
				}else{
					svc_megnific_script_with_content();
				}*/
            }
        }
        var Utility = {
            request: function(url, callback) {
                $.ajax({
                    url: url,
                    dataType: 'jsonp',
                    success: callback
                });
            },
			request_json: function(url, callback) {
                $.ajax({
                    url: url,
                    dataType: 'json',
                    success: callback
                });
            },
            get_request: function(url, callback) {
                $.get(url, callback, 'json');
            },
            wrapLinks: function(string, social_network) {
                var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
                if (social_network === 'google-plus' || social_network === 'tumblr') {
                    string = string.replace(/(@|#)([a-z0-9_]+['])/ig, Utility.wrapGoogleplusTagTemplate);
                } else {
                    string = string.replace(exp, Utility.wrapLinkTemplate);
                }
                return string;
            },
            wrapLinkTemplate: function(string) {
                return '<a target="_blank" href="' + string + '">' + string + '<\/a>';
            },
            wrapGoogleplusTagTemplate: function(string) {
                return '<a target="_blank" href="https://plus.google.com/s/' + string + '" >' + string + '<\/a>';
            },
            shorten: function(string) {
                string = $.trim(string);
                if (string.length > options.length) {
                    return jQuery.trim(string).substring(0, options.length).split(" ").slice(0, -1).join(" ") + "...";
                } else {
                    return string;
                }
            },
            stripHTML: function(string) {
                if (typeof string === "undefined" || string === null) {
                    return '';
                }
                return string.replace(/(<([^>]+)>)|nbsp;|\s{2,}|/ig, "");
            },
			isotop_loop: function(){
				sv++;
				console.log(si+' = '+sv);
				//if(si === sv){
					fireCallback(social_dataa);
				//}
			},
			isotop_insert: function(rendered_html){
				jQuery('.social-feed-container_'+options.stream_id).isotope({transformsEnabled: false,isResizeBound: false,transitionDuration: 0}).isotope( 'insert',jQuery( rendered_html ) );
			}
        };
        function SocialFeedPost(social_network, data) {
            this.content = data;
            this.content.social_network = (social_network == 'vimeo') ? 'vimeo-square' : social_network;
            this.content.attachment = (this.content.attachment === undefined) ? '' : this.content.attachment;
            this.content.time_ago = data.dt_create.fromNow();
            this.content.dt_create = this.content.dt_create.locale('en').format("MMMM DD, YYYY");
            //this.content.dt_create = this.content.dt_create.valueOf();
            this.content.text = Utility.wrapLinks(Utility.shorten(data.message + ' ' + data.description), data.social_network);
            this.content.moderation_passed = (options.moderation) ? options.moderation(this.content) : true;
			this.content.effect = options.effect;
			this.content.grid_columns_count_for_desktop = options.grid_columns_count_for_desktop;
			this.content.grid_columns_count_for_tablet = options.grid_columns_count_for_tablet;
			this.content.grid_columns_count_for_mobile = options.grid_columns_count_for_mobile;
			this.content.popup = options.popup;
            Feed[social_network].posts.push(this);
        }
        SocialFeedPost.prototype = {
            render: function() {
                var rendered_html = Feed.template(this.content);
                var data = this.content;
                if ($(container).children('[social-feed-id=' + data.id + ']').length !== 0) {
                    return false;
                }
                if ($(container).children().length === 0) {
				   if($('.social-feed-container_'+options.stream_id).html() === ''){
					   social_dataa += rendered_html;
						//Utility.isotop_insert(rendered_html);
				   }else{
					   social_dataa += rendered_html;
						//$(container).append(rendered_html);
						/*jQuery('.social-feed-container_'+options.stream_id).isotope({
							itemSelector: '.svc-social-item',
							transformsEnabled: false,
							isResizeBound: true,
							transitionDuration: '0.8s',
							filter: '*',							
							layoutMode: 'masonry',
							masonry: {
								columnWidth: 1
							}
						});	*/
					}
                } else {
                    var i = 0,
                        insert_index = -1;
                    $.each($(container).children(), function() {
                        if ($(this).attr('dt-create') < data.dt_create) {
                            insert_index = i;
                            return false;
                        }
                        i++;
                    });
					
					social_dataa += rendered_html;
					//Utility.isotop_insert(rendered_html);
					
                    /*if (insert_index >= 0) {
                        insert_index++;
                        var before = $(container).children('div:nth-child(' + insert_index + ')'),
                            current = $(container).children('div:last-child');
                        $(current).insertBefore(before);
                    }*/
                }
				
                if (options.media_min_width) {
					var query = '[social-feed-id=' + data.id + '] img.attachment';
					var image = $(query);
					// preload the image
					var height, width = '';
					var img = new Image();
					var imgSrc = image.attr("src");
					$(img).load(function () {
					    if (img.width < options.media_min_width) {
                            //image.hide();
                        }
					    // garbage collect img
					    delete img;
					}).error(function () {
					    // image couldnt be loaded
					    image.hide();
					}).attr({ src: imgSrc });
				}
				
            }
        };
        var Feed = {
                template: false,
                init: function() {
                    Feed.getTemplate(function() {
                        social_networks.forEach(function(network) {
                            if (options[network]) {
                                options[network].accounts.forEach(function(account) {
									si++;
                                    Feed[network].getData(account);
                                });
                            }
                        });
						console.log(si);
                    });
                },
                getTemplate: function(callback) {
                    if (Feed.template){
                        return callback();
					}else {
                        if (options.template_html) {
                            Feed.template = doT.template(options.template_html);
                            return callback();
                        } else {
                            $.get(options.template, function(template_html) {
                                Feed.template = doT.template(template_html);
                                return callback();
                            });
                        }
                    }
                },
                twitter: {
                    posts: [],
                    loaded: false,
                    api: 'http://api.tweecool.com/',
                    getData: function(account) {
						if($('#social_load_more_btn_'+options.stream_id).attr('data-twitter') == 'finish'){
							sv++;	
						}
                        switch (account[0]) {
                            case '@':
								var userid = account.substr(1);
								var max_id = '';
								var first_tweet_load = '';
								var twit_max_id = $('#social_load_more_btn_'+options.stream_id).attr('data-twitter');
								if(twit_max_id != '' && typeof twit_max_id != 'undefined'){
									max_id = '&max_id='+twit_max_id;
									options.twitter.limit = parseInt(options.twitter.limit) + 1;
								}
								
								if(twit_max_id != '' && typeof twit_max_id != 'undefined' && twit_max_id != 'finish'){
									first_tweet_load = '&ajx=y';
								}
								if(twit_max_id != 'finish'){
									$.ajax({
										url: svc_ajax_url.url,
										data : 'action=svc_get_tweet'+first_tweet_load+'&on_cache=yes&cache_time='+options.cache_time+'&cache_id='+options.cache_id+'&user_name='+userid+'&limit='+options.twitter.limit+max_id,
										dataType:"json",
										type: 'POST',
										success: function(response) {
											Feed.twitter.utility.getPosts(response,'');
										}
									});
								}
                                break;
                            case '#':
                                var hashtag = account.substr(1);
								if(typeof options.twitter.loadmore === 'undefined'){
									var main_lm = 'action=svc_get_search_tweet&q='+hashtag+'&on_cache=yes&cache_time='+options.cache_time+'&cache_id='+options.cache_id+'&limit='+options.twitter.limit;
								}else{
									var lm = options.twitter.loadmore;
									var main_lm = 'action=svc_get_search_tweet&other=yes&ajx=y&limit='+options.twitter.limit+'&que='+lm.replace('?','');
								}
								$.ajax({
									url: svc_ajax_url.url,
									data : main_lm,
									dataType:"json",
									type: 'POST',
									success: function(reply) {
										if (typeof reply['search_metadata'] === "undefined") {
											reply['search_metadata'] = "undefined";
											reply['search_metadata']['next_results'] = "undefined";
										}
										if (typeof reply['search_metadata']['next_results'] !== "undefined" && reply['search_metadata']['next_results'] !== "undefined") {
											$('#social_load_more_btn_'+options.stream_id).attr('data-twitter',reply['search_metadata']['next_results']);
										}else{
											$('#social_load_more_btn_'+options.stream_id).attr('data-twitter','');
										}
										Feed.twitter.utility.getPosts(reply.statuses,'search');
									}
								});
                                break;
                            default:
                        }
                    },
                    utility: {
                        getPosts: function(json,searchh) {
							if(json.length == 0){
								$('#social_load_more_btn_'+options.stream_id).attr('data-twitter','finish');	
							}
                            if (json) {
								var tc = 0;
                                $.each(json, function() {
									tc++;							
                                    var element = this;
									if(searchh != 'search'){
										$('#social_load_more_btn_'+options.stream_id).attr('data-twitter',element['id']);
									}
                                    var post = new SocialFeedPost('twitter', Feed.twitter.utility.unifyPostData(element));
                                    post.render();
                                });
								
								if(json.length == tc){
									Utility.isotop_loop();	
								}
								
                            }
                        },
                        unifyPostData: function(element) {
							//console.log(element);
                            var post = {};
                            if (element.id) {
                                post.id = element.id;				
                                post.dt_create = moment(element.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en');
                                post.author_link = 'http://twitter.com/' + element.user.screen_name;
                                if (location.protocol == 'https:'){
                                	post.author_picture = element.user.profile_image_url_https;
								}else{
									post.author_picture = element.user.profile_image_url;
								}
                                post.post_url = post.author_link + '/status/' + element.id_str;
                                post.author_name = element.user.name;
                                post.message = element.text;
                                post.description = '';
                                post.link = 'http://twitter.com/' + element.user.screen_name + '/status/' + element.id_str;
                                if (options.show_media === true) {
                                    if (element.entities.media && element.entities.media.length > 0) {
										if (location.protocol == 'https:'){
											var image_url = element.entities.media[0].media_url_https;
										}else{
											var image_url = element.entities.media[0].media_url;
										}
                                        if (image_url) {
											if(options.popup == 'p1'){
                                            	post.attachment = '<a href="'+image_url+'" class="svc_big_img"><img class="svc_attachment" src="' + image_url + '" /></a>';
											}
											if(options.popup == 'p2'){
												post.attachment = '<a href="'+image_url+'" data-mfp-src="'+svc_ajax_url.url+'?action=svc_inline_social_popup&network=twitter&twiit_id='+element.id_str+'&image_url='+image_url+'&authore_name='+element.user.name+'&authore_img='+element.user.profile_image_url+'&retweet='+element.retweet_count+'&like='+element.favorite_count+'&username='+element.user.screen_name+'&msg='+element.text+'" class="svc_big_img"><img class="svc_attachment" src="' + image_url + '" /></a>';
											}
                                        }
                                    }
                                }
                            }
							post.feed = "svc_twitter";
                            return post;
                        },
                    }
                },
                facebook: {
                    posts: [],
                    graph: 'https://graph.facebook.com/',
                    loaded: false,
                    getData: function(account) {
						var request_url, limit = 'limit=' + options.facebook.limit+'&fields=id,full_picture,created_time,from{id,name,picture},message,link,type,shares,object_id,attachments',
							query_extention = '&access_token=' + options.facebook.access_token + '&callback=?';
						if(typeof options.facebook.loadmore === 'undefined'){
							switch (account[0]) {
								case '@':
									var username = account.substr(1);
									$.ajax({
										url: svc_ajax_url.url,
										data : 'action=svc_fbs_social_stream_get_fb_post&username='+username+'&count='+options.facebook.limit+'&cache_time='+options.cache_time+'&cache_id='+options.cache_id,
										dataType:"json",
										type: 'POST',
										success: function(response) {	
											Feed.facebook.utility.getPosts(response);
											//console.log(response);
										}
									});
									request_url = Feed.facebook.graph + 'v3.1/' + username + '/posts?' + limit + query_extention;
									console.log(request_url);
									break;
								case '#':
									var username = account.substr(1);
									request_url = Feed.facebook.graph + 'v3.1/' + username + '/feed?' + limit + query_extention;
									break;
								default:
									var username = account.substr(1);
									request_url = Feed.facebook.graph + 'v3.1/' + username + '/posts?' + limit + query_extention;
							}
							//Utility.request(request_url, Feed.facebook.utility.getPosts);
						}else{
							if(options.facebook.loadmore != ''){
								request_url = options.facebook.loadmore;
								Utility.request(request_url, Feed.facebook.utility.getPosts);
							}
							if(options.facebook.loadmore == ''){
								sv++;
							}
						}
                    },
                    utility: {
                        prepareAttachment: function(element) {
							//console.log(element);
							var fb_type = element.type;
                            var image_url = element.full_picture;
                            if (element.full_picture) {
                                image_url = element.full_picture;//Feed.facebook.graph + element.object_id + '/picture/?type=normal';
                            }
							if(options.popup == 'p1'){
	                            return '<a href="'+image_url+'" class="svc_big_img"><img class="svc_attachment" src="' + image_url + '" /></a>';
							}else{
                                if(typeof element.shares == 'undefined'){
                                    var fb_share_count = 0;
                                }else{
                                    var fb_share_count = element.shares.count;
                                }
								
								
								var fb_story_popup = (element.message) ? element.message : '';
								if(fb_type == 'video'){
									return '<a href="'+image_url+'" data-mfp-src="'+svc_ajax_url.url+'?action=svc_inline_social_popup&network=facebook&facebook_id='+element.object_id+'&fb_type='+fb_type+'&story='+fb_story_popup+'&share='+fb_share_count+'" class="svc_big_img"><img class="svc_attachment" src="' + image_url + '' + '" /></a>';
								}else if(fb_type == 'link'){
									var el_object_id = element.id;
									var el_object_id_array = el_object_id.split('_');
									el_object_id = el_object_id_array[1];									
									//var image_url_popup = image_url.replace(/&/g,'||');
									return '<a href="'+image_url+'" data-mfp-src="'+svc_ajax_url.url+'?action=svc_fb_twit_insta_inline_social_popup&network=facebook&facebook_id='+el_object_id+'&fb_type='+fb_type+'&story='+element.message+'&share='+fb_share_count+'&img='+image_url+'" class="svc_big_img"><img class="svc_attachment" src="' + image_url + '' + '" /></a>';
								}else{
									return '<a href="'+image_url+'" data-mfp-src="'+svc_ajax_url.url+'?action=svc_inline_social_popup&network=facebook&facebook_id='+element.object_id+'&fb_type='+fb_type+'&story='+fb_story_popup+'&share='+fb_share_count+'" class="svc_big_img"><img class="svc_attachment" src="' + image_url + '' + '" /></a>';
								}
							}
                        },
                        getExternalImageURL: function(image_url, parameter) {
                            image_url = decodeURIComponent(image_url).split(parameter + '=')[1];
                            if (image_url.indexOf('fbcdn-sphotos') === -1) {
                                return image_url.split('&')[0];
                            } else {
                                return image_url;
                            }
                        },
                        getPosts: function(json) {
							if (typeof json['paging'] === "undefined") {
								json['paging'] = "undefined";
								json['paging']['next'] = "undefined";
							}
							if (typeof json['paging']['next'] !== "undefined" && json['paging']['next'] !== "undefined") {
								$('#social_load_more_btn_'+options.stream_id).attr('data-facebook',json['paging']['next']);
							}else{
								$('#social_load_more_btn_'+options.stream_id).attr('data-facebook','');	
							}
                            if (json['data']){
								var c = 0;
                                json['data'].forEach(function(element) {
									c++;
                                    var post = new SocialFeedPost('facebook', Feed.facebook.utility.unifyPostData(element));
                                    post.render();
                                });
								if(json['data'].length == c){
									Utility.isotop_loop();	
								}
                            }
                        },
                        unifyPostData: function(element) {
                            var post = {},
                                text = (element.message) ? element.message : '';

							if(text == '' || text == 'undefined' || typeof text == "undefined"){
								if(element.attachments.data[0].type == 'cover_photo'){
									text = 'cover photo';	
								}
							}
                            post.id = element.id;
                            post.dt_create = moment(element.created_time);
                            post.author_link = 'http://facebook.com/' + element.from.id;
                            //post.author_picture = Feed.facebook.graph + element.from.id + '/picture';
							post.author_picture = element.from.picture.data.url;
                            post.author_name = element.from.name;
                            post.name = element.name || "";
                            post.message = (text) ? text : '';
                            post.description = (element.description) ? element.description : '';
                            post.link = (element.link) ? element.link : 'http://facebook.com/' + element.from.id;
                            if (options.show_media === true) {
                                if (element.full_picture) {
                                    var attachment = Feed.facebook.utility.prepareAttachment(element);
                                    if (attachment) {
                                        post.attachment = attachment;
                                    }
                                }
                            }
							post.feed = "svc_facebook";
                            return post;
                        }
                    }
                },
                google: {
                    posts: [],
                    loaded: false,
                    api: 'https://www.googleapis.com/plus/v1/',
                    getData: function(account) {
                        var request_url;
                        switch (account[0]) {
                            case '#':
                                var hashtag = account.substr(1);
								if(typeof options.google.loadmore === 'undefined'){
                                request_url = Feed.google.api + 'activities?query=' + hashtag + '&key=' + options.google.access_token + '&maxResults=' + options.google.limit;
								Utility.get_request(request_url, Feed.google.utility.getPosts);
								}else{
									if(options.google.loadmore != ''){
										request_url = Feed.google.api + 'activities?query=' + hashtag + '&key=' + options.google.access_token + '&maxResults=' + options.google.limit+'&pageToken='+options.google.loadmore;
										Utility.get_request(request_url, Feed.google.utility.getPosts);
									}
									if(options.google.loadmore == ''){
										sv++;
									}	
								}
                                break;
                            case '@':
                                var username = account.substr(1);
								if(typeof options.google.loadmore === 'undefined'){
                                request_url = Feed.google.api + 'people/' + username + '/activities/public?key=' + options.google.access_token + '&maxResults=' + options.google.limit;
								Utility.get_request(request_url, Feed.google.utility.getPosts);
								}else{
									if(options.google.loadmore != ''){
										request_url = Feed.google.api + 'people/' + username + '/activities/public?key=' + options.google.access_token + '&maxResults=' + options.google.limit+'&pageToken='+options.google.loadmore;
										Utility.get_request(request_url, Feed.google.utility.getPosts);
									}
									if(options.google.loadmore == ''){
										sv++;
									}
								}
                                
                                break;
                            default:
                        }
                    },
                    utility: {
                        getPosts: function(json) {
							if (typeof json['nextPageToken'] !== "undefined") {
								$('#social_load_more_btn_'+options.stream_id).attr('data-gplus',json['nextPageToken']);
							}else{
								$('#social_load_more_btn_'+options.stream_id).attr('data-gplus','');	
							}
                            if (json.items) {
								var gc = 0;
								json['items'].forEach(function(element) {
									gc++;
                                    var post = new SocialFeedPost('google', Feed.google.utility.unifyPostData(element));
                                    post.render();
                                });
								
								if(json['items'].length == gc){
									Utility.isotop_loop();	
								}
                            }
                        },
                        unifyPostData: function(element) {
                            var post = {};
                            post.id = element.id;
                            post.attachment = '';
                            post.description = '';
                            post.dt_create = moment(element.published);
                            post.author_link = element.actor.url;
                            post.author_picture = element.actor.image.url;
                            post.author_name = element.actor.displayName;
                            if (options.show_media === true) {
                                if (element.object.attachments) {
                                    $.each(element.object.attachments, function() {
                                        var image = '';//channel_script_vars.blank_image_url;
                                        if (this.fullImage) {
                                            image = this.fullImage.url;
                                        } else {
                                            if (this.objectType === 'album') {
                                                if (this.thumbnails && this.thumbnails.length > 0) {
                                                    if (this.thumbnails[0].image) {
                                                        image = this.thumbnails[0].image.url;
                                                    }
                                                }
                                            }
                                        }
										if(image != '' && image != 'https://s0.wp.com/i/blank.jpg'){
                                        	post.attachment = '<a href="'+image+'" class="svc_gplus_img"><img class="svc_attachment" src="' + image + '"/></a>';
										}else{
											post.attachment = '';
										}
                                    });
                                }
                            }
                            post.message = element.title;
                            post.link = element.url;
							post.feed = "svc_gplus";
                            return post;
                        }
                    }
                },
                instagram: {
                    posts: [],
                    api: 'https://api.instagram.com/v1/',
                    loaded: true,
                    getData: function(account) {
                        var url;
						if(typeof options.instagram.loadmore === 'undefined'){
                            if(options.instagram.instagram_access_token){
    							switch (account[0]) {
    								case '@':
    									var id = account.substr(1);
										if(options.instagram.already_cache != 0){
											var postData = {
												action: 'svc_fb_you_vimeo_twit_insta_get_insta_post',
												userid: options.instagram.already_cache,
												count: options.instagram.limit,
												cache_time: options.cache_time,
												type: 'user'
											};
											$.ajax({
												url: svc_ajax_url.url,
												data : postData,
												dataType:"json",
												type: 'POST',
												success: function(response) {
													Feed.instagram.utility.getImages(response);
													//console.log(response);
												}
											});
										}else{
											$.ajax({
												type: 'GET',
												url: 'https://www.instagram.com/'+id+'/?__a=1',
												async: true,
												cache: false,
												success: function(r){
													var instaData = {
														profile_pic_url: r.graphql.user.profile_pic_url,
														full_name: r.graphql.user.full_name,
														username: r.graphql.user.username,
														id: r.graphql.user.id
													}
													
													var postData = {
														action: 'svc_fb_you_vimeo_twit_insta_get_insta_post',
														userid: r.graphql.user.id,
														count: options.instagram.limit,
														cache_time: options.cache_time,
														type: 'user',
														user_data: JSON.stringify(instaData)
														//res: r
													};
													$.ajax({
														url: svc_ajax_url.url,
														data : postData,
														dataType:"json",
														type: 'POST',
														success: function(response) {
															Feed.instagram.utility.getImages(response);
															//console.log(response);
														}
													});
												}
											});
										}
										/*$.ajax({
											url: svc_ajax_url.url,
											data : 'action=svc_fb_you_vimeo_twit_insta_get_insta_post&userid='+id+'&count='+options.instagram.limit+'&cache_time='+options.cache_time+'&cache_id='+options.cache_id,
											dataType:"json",
											type: 'POST',
											success: function(response) {
												Feed.instagram.utility.getImages(response);
												//console.log(response);
											}
										});*/
    									//url = Feed.instagram.api + 'users/search/?q=' + username + '&access_token='+options.instagram.instagram_access_token+'&' + 'client_id=' + options.instagram.client_id + '&count=1' + '&callback=?';
                                        //url = Feed.instagram.api + 'users/self/?access_token='+options.instagram.instagram_access_token;
    									//Utility.request(url, Feed.instagram.utility.getUsers);
    									break;
    								case '#':
    									var hashtag = account.substr(1);
										$.ajax({
											url: svc_ajax_url.url,
											data : 'action=svc_fb_you_vimeo_twit_insta_get_insta_post&userid='+hashtag+'&count='+options.instagram.limit+'&cache_time='+options.cache_time+'&type=hash',
											dataType:"json",
											type: 'POST',
											success: function(response) {
												Feed.instagram.utility.getImages(response);
												//console.log(response);
											}
										});
    									//url = Feed.instagram.api + 'tags/' + hashtag + '/media/recent/?' + 'client_id=' + options.instagram.client_id + '&access_token='+options.instagram.instagram_access_token+'&' + 'count=' + options.instagram.limit + '&callback=?';
    									//Utility.request(url, Feed.instagram.utility.getImages);
    									break;
    								case '&':
    									var id = account.substr(1);
    									url = Feed.instagram.api + 'users/' + id  + '/?client_id=' + options.instagram.client_id + '&access_token='+options.instagram.instagram_access_token+'&' + 'count=' + options.instagram.limit + '&callback=?';
    									Utility.request(url, Feed.instagram.utility.getUsers);
    								default:
    							}
                            }
						}else{
							if(options.instagram.loadmore != ''){
								url = options.instagram.loadmore;
								//Utility.request(url, Feed.instagram.utility.getImages);
								var postData = {
									action: 'svc_fb_you_vimeo_twit_insta_get_insta_post',
									next_url: url,
									load_more: 'yes',
									cache_time: 1400
								};
								$.ajax({
									url: svc_ajax_url.url,
									data : postData,
									dataType:"json",
									type: 'POST',
									success: function(response) {
										Feed.instagram.utility.getImages(response);
										//console.log(response);
									}
								});
							}
							if(options.instagram.loadmore == ''){
								sv++;
								var twitter_data = $('#social_load_more_btn_'+options.stream_id).attr('data-twitter');
								var instagram_data = $('#social_load_more_btn_'+options.stream_id).attr('data-instagram');
								var facebook_data = $('#social_load_more_btn_'+options.stream_id).attr('data-facebook');
								var you_data = $('#social_load_more_btn_'+options.stream_id).attr('data-youtube');
								var vimeo_data = $('#social_load_more_btn_'+options.stream_id).attr('data-vimeo');
								if(twitter_data == '' && instagram_data == '' && facebook_data == '' && you_data == '' && vimeo_data == ''){
									$('#svc_infinite').hide();
								}
							}
						}
                    },
                    utility: {
                        getImages: function(json) {
                            //console.log(json['pagination']);
							if (typeof json['pagination'] == "undefined" || json['pagination'] == null) {
								json['pagination'] = 'undefined';
								json['pagination']['next_url'] = "undefined";
							}
							if (typeof json['pagination']['next_url'] !== "undefined" && json['pagination']['next_url'] !== "undefined") {
								$('#social_load_more_btn_'+options.stream_id).attr('data-instagram',json['pagination']['next_url']);
							}else{
								$('#social_load_more_btn_'+options.stream_id).attr('data-instagram','');	
							}
                            if (json.data) {
								var ic = 0;
                                json.data.forEach(function(element) {
									ic++;
                                    var post = new SocialFeedPost('instagram', Feed.instagram.utility.unifyPostData(element));
                                    post.render();
                                });
								
								if(json.data.length == ic){
									Utility.isotop_loop();	
								}
                            }
                        },
                        getUsers: function(json) {
							if (typeof json['pagination'] === "undefined") {
								json['pagination'] = "undefined";
								json['pagination']['next_url'] = "undefined";
							}
							if (typeof json['pagination']['next_url'] !== "undefined" && json['pagination']['next_url'] !== "undefined") {
								$('#social_load_more_btn_'+options.stream_id).attr('data-instagram',json['pagination']['next_url']);
							}else{
								$('#social_load_more_btn_'+options.stream_id).attr('data-instagram','');	
							}
							
                            if( ! jQuery.isArray(json.data)) json.data = [json.data]
                            json.data.forEach(function(user) {
								//var url = Feed.instagram.api + 'users/' + user['id'] + '/media/recent/?' + 'access_token=260796206.0efbe26.89a76a9668934089a2d00d928486fd26&count=' + options.instagram.limit + '&callback=?';
                                var url = Feed.instagram.api + 'users/' + user.id + '/media/recent/?' + 'access_token='+options.instagram.instagram_access_token+'&' + 'count=' + options.instagram.limit + '&callback=?';
                                Utility.request(url, Feed.instagram.utility.getImages);
                            });
                        },
                        unifyPostData: function(element) {
                            var post = {};
                            post.id = element.id;
                            post.dt_create = moment(element.created_time * 1000);
                            post.author_link = 'http://instagram.com/' + element.user.username;
                            post.author_picture = element.user.profile_picture;
                            post.author_name = element.user.full_name;
                            post.message = (element.caption && element.caption) ? element.caption.text : '';
                            post.description = '';
                            post.link = element.link;
                            //console.log(element.images);
                            if (options.show_media) {
								if(options.popup == 'p1'){
									if(typeof element.images.__original != "undefined"){
										var popup_img = element.images.__original.url;
									}else{
										var popup_img = element.images.standard_resolution.url
									}
									
                                	post.attachment = '<a href="'+popup_img+'" class="svc_big_img"><img class="svc_attachment" src="' + element.images.standard_resolution.url + '' + '" /></a>';
								}else{
									post.attachment = '<a href="'+element.images.standard_resolution.url+'" data-mfp-src="'+svc_ajax_url.url+'?action=svc_inline_social_popup&network=instagram&url='+element.link+'" class="svc_big_img"><img class="svc_attachment" src="' + element.images.standard_resolution.url + '' + '" /></a>';
								}
                            }
							post.feed = "svc_instagram";
                            return post;
                        }
                    }
                },
				tumblr: {
                    posts: [],
                    graph: 'http://api.tumblr.com/v2/blog/',
                    loaded: false,
                    getData: function(account) {
						var request_url = '',
							username_url = account.substr(1)+'.tumblr.com/posts?',
							query_extention = '&api_key=' + options.tumblr.api_key + '&notes_info=true&limit='+options.tumblr.limit;
						if(typeof options.tumblr.loadmore === 'undefined'){
							request_url = Feed.tumblr.graph + username_url + query_extention;
							Utility.request(request_url, Feed.tumblr.utility.getPosts);
						}else{
							if(options.tumblr.loadmore != ''){
								request_url = Feed.tumblr.graph + username_url + query_extention + '&offset='+options.tumblr.loadmore;
								Utility.request(request_url, Feed.tumblr.utility.getPosts);
							}
							if(options.tumblr.loadmore == ''){
								sv++;
							}
						}
                    },
                    utility: {
                        prepareAttachment: function(element) {
							var ori_image_url = element.photos[0]['original_size']['url'];
							if(element.photos[0]['alt_sizes'].length == 0){
								var image_url = ori_image_url;
							}else{
								var image_url = element.photos[0]['alt_sizes'][1]['url'];
							}
							if(options.popup == 'p1'){
								return '<a href="'+ori_image_url+'" class="svc_big_img"><img class="svc_attachment" src="' + image_url + '" /></a>';
							}
							if(options.popup == 'p2'){
								var tumb_id = element.id;
								var blog_name = element.blog_name;
								return '<a href="'+ori_image_url+'" data-mfp-src="'+svc_ajax_url.url+'?action=svc_inline_social_popup&network=tumblr&id='+tumb_id+'&blog_name='+blog_name+'" class="svc_big_img"><img class="svc_attachment" src="' + image_url + '" /></a>';
							}
                        },
                        getExternalImageURL: function(image_url, parameter) {
                            image_url = decodeURIComponent(image_url).split(parameter + '=')[1];
                            if (image_url.indexOf('fbcdn-sphotos') === -1) {
                                return image_url.split('&')[0];
                            } else {
                                return image_url;
                            }
                        },
                        getPosts: function(json) {
							if(typeof options.tumblr.loadmore === 'undefined'){
								$('#social_load_more_btn_'+options.stream_id).attr('data-tumblr',options.tumblr.limit);
							}else{
								var page_offset = parseInt(options.tumblr.limit)+parseInt(options.tumblr.loadmore);
								$('#social_load_more_btn_'+options.stream_id).attr('data-tumblr',page_offset);
								if(page_offset >= parseInt(json['response']['total_posts'])){
									$('#social_load_more_btn_'+options.stream_id).attr('data-tumblr','');
								}
							}
                            if (json['response']){
								var tuc = 0;
                                json['response']['posts'].forEach(function(element) {
									tuc++;
                                    var post = new SocialFeedPost('tumblr', Feed.tumblr.utility.unifyPostData(element));
                                    post.render();
                                });
								
								if(json['response']['posts'].length == tuc){
									Utility.isotop_loop();	
								}
                            }
                        },
                        unifyPostData: function(element) {
                            var post = {},
                                text = (element.caption) ? element.caption : element.caption;
                            post.id = element.id;
                            post.dt_create = moment(element.date,'YYYY-MM-DD hh:mm:ss');
                            post.author_link = 'http://'+element.blog_name+'.tumblr.com/';
                            post.author_picture = 'http://api.tumblr.com/v2/blog/'+element.blog_name+'.tumblr.com/avatar/512';
                            post.author_name = element.blog_name;
                            post.name = element.name || "";
                            post.message = (text) ? text : '';
                            post.description = '';//(element.caption) ? element.caption : '';
                            post.link = (element.post_url) ? element.post_url : 'http://'+element.blog_name+'.tumblr.com/';
                            if (options.show_media === true) {
                                if (element.photos) {
                                    var attachment = Feed.tumblr.utility.prepareAttachment(element);
                                    if (attachment) {
                                        post.attachment = attachment;
                                    }
                                }
                            }
							post.feed = "svc_tumblr";
							
                            return post;
                        }
                    }
                },
				/*youtube: {
                    posts: [],
                    graph: 'https://www.googleapis.com/youtube/v3/',
                    loaded: false,
                    getData: function(account) {
						var request_url = '';
                        if(typeof options.youtube.channel_id != 'undefined' && options.youtube.channel_id != ''){
                            //console.log('channel');
                            Feed.youtube.utility.getChannels_data(options.youtube.channel_id);
                        }else if(typeof options.youtube.loadmore === 'undefined'){
                            if(options.youtube.playlistid != '' && typeof options.youtube.playlistid != 'undefined'){
                                //console.log('playlist');
                                request_url = Feed.youtube.graph + 'playlistItems?part=snippet,contentDetails,id&playlistId='+options.youtube.playlistid+'&maxResults='+options.youtube.limit+'&key='+ options.youtube.access_token;
                                Utility.request(request_url, Feed.youtube.utility.getChannel_data_for_playlist);
                            }else{
								 request_url = Feed.youtube.graph + 'channels?part=id&forUsername='+account+'&key='+ options.youtube.access_token;
								 Utility.request(request_url, Feed.youtube.utility.getChannels);
                            }
						}else{
							var nextpage_token_with_playid = $('#social_load_more_btn_'+options.stream_id).attr('data-youtube');
							var nextpage_token_exp = nextpage_token_with_playid.split('||');
							var nextpage_token = nextpage_token_exp[0];
							var playlistid = nextpage_token_exp[1];
							var author_logo = nextpage_token_exp[2];
							if(nextpage_token != ''){
								request_url = Feed.youtube.graph + 'playlistItems?part=snippet&playlistId=' + playlistid + '&pageToken='+nextpage_token+'&maxResults='+options.youtube.limit+'&key='+ options.youtube.access_token;
								$.ajax({
									url: request_url,
									dataType: 'jsonp',
									success: function(json){
										Feed.youtube.utility.getPosts(json,playlistid,author_logo);	
									}
								});
							}
							if(nextpage_token == ''){
								sv++;	
							}
						}
                    },
                    utility: {
                        prepareAttachment: function(element,videoId) {
							var video_url = 'https://www.youtube.com/watch?v='+videoId;
                            var image_url = element['medium']['url'];
                            if(options.popup == 'p1'){
                            	return '<a href="'+video_url+'" class="popup-youtube svc_video_play"><img class="svc_attachment" src="' + image_url + '" /></a>';
							}
							if(options.popup == 'p2'){
                            	return '<a href="'+video_url+'" data-mfp-src="'+svc_ajax_url.url+'?action=svc_inline_social_popup&network=youtube&videoId='+videoId+'" class="popup-youtube svc_video_play"><img class="svc_attachment" src="' + image_url + '" /></a>';
							}
                        },
                        getExternalImageURL: function(image_url, parameter) {
                            image_url = decodeURIComponent(image_url).split(parameter + '=')[1];
                            if (image_url.indexOf('fbcdn-sphotos') === -1) {
                                return image_url.split('&')[0];
                            } else {
                                return image_url;
                            }
                        },
                        getChannels_data: function(cid){
                            request_url = Feed.youtube.graph + 'channels?part=brandingSettings,snippet,statistics,contentDetails&id='+cid+'&key='+ options.youtube.access_token;
                            Utility.request(request_url, Feed.youtube.utility.getPlaylistid);
                        },
						getChannels: function(json){
							var cid = json['items'][0]['id'];
							request_url = Feed.youtube.graph + 'channels?part=brandingSettings,snippet,statistics,contentDetails&id='+cid+'&key='+ options.youtube.access_token;
							Utility.request(request_url, Feed.youtube.utility.getPlaylistid);
						},
						getPlaylistid: function(json){
							var author_logo = json['items'][0]['snippet']['thumbnails']['default']['url'];
							var playlistid = json['items'][0]['contentDetails']['relatedPlaylists']['uploads'];
							request_url = Feed.youtube.graph + 'playlistItems?part=snippet&playlistId='+playlistid+'&maxResults='+options.youtube.limit+'&key='+ options.youtube.access_token;
							$.ajax({
								url: request_url,
								dataType: 'jsonp',
								success: function(json){
									Feed.youtube.utility.getPosts(json,playlistid,author_logo);
								}
							});
						},
                        getChannel_data_for_playlist: function(json){
                            var cid = json['items'][0]['snippet']['channelId'];
                            request_url = Feed.youtube.graph + 'channels?part=brandingSettings,snippet,statistics,contentDetails&id='+cid+'&key='+ options.youtube.access_token;
                            $.ajax({
                                url: request_url,
                                dataType: 'jsonp',
                                success: function(jsonn){
                                    var author_logo = jsonn['items'][0]['snippet']['thumbnails']['default']['url'];
                                    var playlistid = jsonn['items'][0]['contentDetails']['relatedPlaylists']['uploads'];
                                    Feed.youtube.utility.getPosts(json,playlistid,author_logo);
                                }
                            });
                        },
                        getPosts: function(json,playlistid,author_logo) {
							if(typeof options.youtube.loadmore === 'undefined'){
								$('#social_load_more_btn_'+options.stream_id).attr('data-youtube',json['nextPageToken']+'||'+playlistid+'||'+author_logo);
							}else{
								if(typeof json['nextPageToken'] === 'undefined'){
									$('#social_load_more_btn_'+options.stream_id).attr('data-youtube','');
								}else{
									$('#social_load_more_btn_'+options.stream_id).attr('data-youtube',json['nextPageToken']+'||'+playlistid+'||'+author_logo);
								}
							}
                            if (json['items']){
								var yc = 0;
                                if(json['items'].length == 0){
                                    $('#svc_infinite').hide();
                                }
                                json['items'].forEach(function(element) {
									yc++;
                                    var post = new SocialFeedPost('youtube', Feed.youtube.utility.unifyPostData(element,author_logo));
                                    post.render();
                                });
								
								if(json['items'].length == yc){
									Utility.isotop_loop();	
								}
                            }
                        },
                        unifyPostData: function(element,author_logo) {
							var yid = element.id;
							element = element.snippet;
                            var post = {},
                                text = (element.description) ? element.description : element.description;
                            post.id = yid;
                            post.dt_create = moment(element.publishedAt,'YYYY-MM-DD hh:mm:ss');
                            post.author_link = 'http://www.youtube.com/user/'+element.channelTitle;
                            post.author_picture = author_logo;
                            post.author_name = element.channelTitle;
                            post.name = element.title || "";
                            post.message = (text) ? text : '';
                            post.description = '';//(element.caption) ? element.caption : '';
                            post.link = (element.resourceId) ? 'https://www.youtube.com/watch?v='+element.resourceId.videoId : 'http://www.youtube.com/user/'+element.channelTitle;
                            if (options.show_media === true) {
                                if (element.thumbnails) {
                                    var attachment = Feed.youtube.utility.prepareAttachment(element.thumbnails,element.resourceId.videoId);
                                    if (attachment) {
                                        post.attachment = attachment;
                                    }
                                }
                            }
							post.feed = "svc_youtube";
							
                            return post;
                        }
                    }
                },*/
				youtube: {
                    posts: [],
                    graph: 'https://www.googleapis.com/youtube/v3/',
                    loaded: false,
                    getData: function(account) {
						var request_url = '';
                        /*if(typeof options.youtube.channel_id != 'undefined' && options.youtube.channel_id != ''){
                            //console.log('channel');
                            Feed.youtube.utility.getChannels_data(options.youtube.channel_id);
                        }else if(typeof options.youtube.loadmore === 'undefined'){
                            if(options.youtube.playlistid != '' && typeof options.youtube.playlistid != 'undefined'){
                                //console.log('playlist');
                                request_url = Feed.youtube.graph + 'playlistItems?part=snippet,contentDetails,id&playlistId='+options.youtube.playlistid+'&maxResults='+options.youtube.limit+'&key='+ options.youtube.access_token;
                                Utility.request(request_url, Feed.youtube.utility.getChannel_data_for_playlist);
                            }else{
								 request_url = Feed.youtube.graph + 'channels?part=id&forUsername='+account+'&key='+ options.youtube.access_token;
								 Utility.request(request_url, Feed.youtube.utility.getChannels);
                            }
						}*/
						
						if(typeof options.youtube.loadmore === 'undefined'){
							if(typeof options.youtube.channel_id != 'undefined' && options.youtube.channel_id != ''){
								var username = options.youtube.channel_id;
								$.ajax({
									url: svc_ajax_url.url,
									data : 'action=svc_fbs_you_vimeo_twit_insta_get_youtube_post&username='+username+'&count='+options.youtube.limit+'&cache_time='+options.cache_time+'&cache_id='+options.cache_id+'&type=channel',
									dataType:"json",
									type: 'POST',
									success: function(response) {
										var next_token = response.next_page_token;
										var res = response.data;
										var author_logo = response.author_logo;
										var playlistid = response.playlistid;
										Feed.youtube.utility.getPosts(res,playlistid,author_logo,next_token);
									}
								});
							}else if(options.youtube.playlistid != '' && typeof options.youtube.playlistid != 'undefined'){
								var username = options.youtube.playlistid;
								$.ajax({
									url: svc_ajax_url.url,
									data : 'action=svc_fbs_you_vimeo_twit_insta_get_youtube_post&username='+username+'&count='+options.youtube.limit+'&cache_time='+options.cache_time+'&cache_id='+options.cache_id+'&type=playlist',
									dataType:"json",
									type: 'POST',
									success: function(response) {
										var next_token = response.next_page_token;
										var res = response.data;
										var author_logo = response.author_logo;
										var playlistid = response.playlistid;
										Feed.youtube.utility.getPosts(res,playlistid,author_logo,next_token);
									}
								});
							}else{
								var username = account;
								$.ajax({
									url: svc_ajax_url.url,
									data : 'action=svc_fbs_you_vimeo_twit_insta_get_youtube_post&username='+username+'&count='+options.youtube.limit+'&cache_time='+options.cache_time+'&cache_id='+options.cache_id+'&type=user',
									dataType:"json",
									type: 'POST',
									success: function(response) {
										var next_token = response.next_page_token;
										var res = response.data;
										var author_logo = response.author_logo;
										var playlistid = response.playlistid;
										Feed.youtube.utility.getPosts(res,playlistid,author_logo,next_token);
									}
								});
							}							
							
						}else{
							var nextpage_token_with_playid = $('#social_load_more_btn_'+options.stream_id).attr('data-youtube');
							var nextpage_token_exp = nextpage_token_with_playid.split('||');
							var nextpage_token = nextpage_token_exp[0];
							var playlistid = nextpage_token_exp[1];
							var author_logo = nextpage_token_exp[2];
							if(nextpage_token != ''){
								request_url = Feed.youtube.graph + 'playlistItems?part=snippet&playlistId=' + playlistid + '&pageToken='+nextpage_token+'&maxResults='+options.youtube.limit+'&key='+ options.youtube.access_token;
								$.ajax({
									url: request_url,
									dataType: 'jsonp',
									success: function(json){
										Feed.youtube.utility.getPosts(json,playlistid,author_logo);	
									}
								});
							}
							if(nextpage_token == ''){
								sv++;
								var twitter_data = $('#social_load_more_btn_'+options.stream_id).attr('data-twitter');
								var instagram_data = $('#social_load_more_btn_'+options.stream_id).attr('data-instagram');
								var facebook_data = $('#social_load_more_btn_'+options.stream_id).attr('data-facebook');
								var you_data = $('#social_load_more_btn_'+options.stream_id).attr('data-youtube');
								var vimeo_data = $('#social_load_more_btn_'+options.stream_id).attr('data-vimeo');
								if(twitter_data == '' && instagram_data == '' && facebook_data == '' && you_data == '' && vimeo_data == ''){
									$('#svc_infinite').hide();
								}
							}
						}
                    },
                    utility: {
                        prepareAttachment: function(element,videoId) {
							var video_url = 'https://www.youtube.com/watch?v='+videoId;
                            var image_url = element['medium']['url'];
                            if(options.popup == 'p1'){
                            	return '<a href="'+video_url+'" class="popup-youtube svc_video_play"><img class="svc_attachment" src="' + image_url + '" /></a>';
							}
							if(options.popup == 'p2'){
                            	return '<a href="'+video_url+'" data-mfp-src="'+svc_ajax_url.url+'?action=svc_inline_social_popup&network=youtube&videoId='+videoId+'" class="popup-youtube svc_video_play"><img class="svc_attachment" src="' + image_url + '" /></a>';
							}
                        },
                        getExternalImageURL: function(image_url, parameter) {
                            image_url = decodeURIComponent(image_url).split(parameter + '=')[1];
                            if (image_url.indexOf('fbcdn-sphotos') === -1) {
                                return image_url.split('&')[0];
                            } else {
                                return image_url;
                            }
                        },
                        getChannels_data: function(cid){
                            request_url = Feed.youtube.graph + 'channels?part=brandingSettings,snippet,statistics,contentDetails&id='+cid+'&key='+ options.youtube.access_token;
                            Utility.request(request_url, Feed.youtube.utility.getPlaylistid);
                        },
						getChannels: function(json){
							var cid = json['items'][0]['id'];
							request_url = Feed.youtube.graph + 'channels?part=brandingSettings,snippet,statistics,contentDetails&id='+cid+'&key='+ options.youtube.access_token;
							Utility.request(request_url, Feed.youtube.utility.getPlaylistid);
						},
						getPlaylistid: function(json){
							var author_logo = json['items'][0]['snippet']['thumbnails']['default']['url'];
							var playlistid = json['items'][0]['contentDetails']['relatedPlaylists']['uploads'];
							request_url = Feed.youtube.graph + 'playlistItems?part=snippet&playlistId='+playlistid+'&maxResults='+options.youtube.limit+'&key='+ options.youtube.access_token;
							$.ajax({
								url: request_url,
								dataType: 'jsonp',
								success: function(json){
									Feed.youtube.utility.getPosts(json,playlistid,author_logo);
								}
							});
						},
                        getChannel_data_for_playlist: function(json){
                            var cid = json['items'][0]['snippet']['channelId'];
                            request_url = Feed.youtube.graph + 'channels?part=brandingSettings,snippet,statistics,contentDetails&id='+cid+'&key='+options.youtube.access_token;
                            $.ajax({
                                url: request_url,
                                dataType: 'jsonp',
                                success: function(jsonn){
                                    var author_logo = jsonn['items'][0]['snippet']['thumbnails']['default']['url'];
                                    var playlistid = jsonn['items'][0]['contentDetails']['relatedPlaylists']['uploads'];
                                    Feed.youtube.utility.getPosts(json,playlistid,author_logo);
                                }
                            });
                        },
                        getPosts: function(json,playlistid,author_logo,next_token) {
							if(typeof options.youtube.loadmore === 'undefined'){
								$('#social_load_more_btn_'+options.stream_id).attr('data-youtube',next_token+'||'+playlistid+'||'+author_logo);
							}else{
								if(typeof next_token === 'undefined' || next_token == ''){
									$('#social_load_more_btn_'+options.stream_id).attr('data-youtube','');
								}else{
									$('#social_load_more_btn_'+options.stream_id).attr('data-youtube',next_token+'||'+playlistid+'||'+author_logo);
								}
							}
                            if (json['items']){
								var yc = 0;
                                if(json['items'].length == 0){
                                    $('#svc_infinite').hide();
                                }
                                json['items'].forEach(function(element) {
									yc++;
                                    var post = new SocialFeedPost('youtube', Feed.youtube.utility.unifyPostData(element,author_logo));
                                    post.render();
                                });
								
								if(json['items'].length == yc){
									Utility.isotop_loop();	
								}
                            }
                        },
                        unifyPostData: function(element,author_logo) {
							var yid = element.id;
							element = element.snippet;
                            var post = {},
                                text = (element.description) ? element.description : element.description;
                            post.id = yid;
                            post.dt_create = moment(element.publishedAt,'YYYY-MM-DD hh:mm:ss');
                            post.author_link = 'http://www.youtube.com/user/'+element.channelTitle;
                            post.author_picture = author_logo;
                            post.author_name = element.channelTitle;
                            post.name = element.title || "";
                            post.message = (text) ? text : '';
                            post.description = '';//(element.caption) ? element.caption : '';
                            post.link = (element.resourceId) ? 'https://www.youtube.com/watch?v='+yid : 'http://www.youtube.com/user/'+element.channelTitle;
                            if (options.show_media === true) {
                                if (element.thumbnails) {
                                    //var attachment = Feed.youtube.utility.prepareAttachment(element.thumbnails,element.resourceId.videoId);
									var attachment = Feed.youtube.utility.prepareAttachment(element.thumbnails,yid);
                                    if (attachment) {
                                        post.attachment = attachment;
										post.popup_link = svc_ajax_url.url+'?action=svc_inline_social_popup&network=youtube&videoId='+yid;
										post.video_link = 'https://www.youtube.com/watch?v='+yid;
                                    }
                                }
                            }
							post.feed = "svc_youtube";
							
                            return post;
                        }
                    }
                },
				vimeo: {
                    posts: [],
					graph: 'https://api.vimeo.com',
                    loaded: false,
                    getData: function(account) {
						var request_url = '';
						if(typeof options.vimeo.loadmore === 'undefined'){
							request_url = Feed.vimeo.graph +'/users/'+ account +'/videos?per_page='+options.vimeo.limit+'&access_token='+options.vimeo.access_token;
							Utility.request_json(request_url, Feed.vimeo.utility.getPosts);
						}else{
							var nextpage_url = options.vimeo.loadmore;
							if(nextpage_url != ''){
								request_url = Feed.vimeo.graph + options.vimeo.loadmore;
								$.ajax({
									url: request_url,
									dataType: 'json',
									success: function(json){
										Feed.vimeo.utility.getPosts(json);	
									}
								});
							}
							if(nextpage_url == ''){
								sv++;	
							}
						}
                    },
                    utility: {
                        prepareAttachment: function(element,video_link,elementtt) {
							var video_id = video_link.split("/");
                            var image_url = element['sizes'][3]['link'];
							if(options.popup == 'p1'){
                            	return '<a href="'+video_link+'" class="popup-vimeo svc_video_play"><img class="svc_attachment" src="' + image_url + '" /></a>';
							}
							if(options.popup == 'p2'){
								return '<a href="'+video_link+'" data-mfp-src="'+svc_ajax_url.url+'?action=svc_inline_social_popup&network=vimeo&videoId='+video_id[3]+'&userid='+options.vimeo.accounts[0]+'&from='+elementtt.user.name+'&profileImg='+elementtt.user.pictures.sizes[1].link+'" class="popup-vimeo svc_video_play"><img class="svc_attachment" src="' + image_url + '" /></a>';
							}
                        },
                        getExternalImageURL: function(image_url, parameter) {
                            image_url = decodeURIComponent(image_url).split(parameter + '=')[1];
                            if (image_url.indexOf('fbcdn-sphotos') === -1) {
                                return image_url.split('&')[0];
                            } else {
                                return image_url;
                            }
                        },
                        getPosts: function(json) {
							if(typeof options.vimeo.loadmore === 'undefined'){
								$('#social_load_more_btn_'+options.stream_id).attr('data-vimeo',json['paging']['next']);
							}else{
								if(json['paging']['next'] == null){
									$('#social_load_more_btn_'+options.stream_id).attr('data-vimeo','');
								}else{
									$('#social_load_more_btn_'+options.stream_id).attr('data-vimeo',json['paging']['next']);
								}
							}
                            if (json['data']){
								var vc = 0;
                                json['data'].forEach(function(element) {
									vc++;
                                    var post = new SocialFeedPost('vimeo', Feed.vimeo.utility.unifyPostData(element));
                                    post.render();
                                });
								
								if(json['data'].length == vc){
									Utility.isotop_loop();	
								}
                            }
                        },
                        unifyPostData: function(element) {
							var yid = element.duration;
							//element = element.snippet;
                            var post = {},
                                text = (element.description) ? element.description : element.description;
                            post.id = yid;
                            post.dt_create = moment(element.created_time,'YYYY-MM-DD hh:mm:ss');
                            post.author_link = element.user.link;
                            post.author_picture = element.user.pictures.sizes[1].link;
                            post.author_name = element.user.name;
                            post.name = element.name || "";
                            post.message = (text) ? text : '';
                            post.description = '';//(element.caption) ? element.caption : '';
                            post.link = element.link
                            if (options.show_media === true) {
                                if (element.pictures) {
                                    var attachment = Feed.vimeo.utility.prepareAttachment(element.pictures,element.link,element);
                                    if (attachment) {
                                        post.attachment = attachment;
                                    }
                                }
                            }
							post.feed = "svc_vimeo";
							
                            return post;
                        }
                    }
                },
                dribbble: {
                    posts: [],
					graph: 'http://api.dribbble.com/players',
                    loaded: false,
                    getData: function(account) {
						var request_url = '';
						if(typeof options.dribbble.loadmore === 'undefined'){
							request_url = Feed.dribbble.graph +'/'+ account +'/shots?per_page='+options.dribbble.limit;
							Utility.request(request_url, Feed.dribbble.utility.getPosts);
						}else{
							var nextpage_page = options.dribbble.loadmore;
							if(nextpage_page != ''){
								request_url = Feed.dribbble.graph +'/'+ account +'/shots?per_page='+options.dribbble.limit+'&page='+options.dribbble.loadmore;
								Utility.request(request_url, Feed.dribbble.utility.getPosts);
							}
							if(nextpage_page == ''){
								sv++;	
							}
						}
                    },
                    utility: {
                        prepareAttachment: function(big_img_link,small_img) {
                            var image_url = big_img_link;
                            return '<a href="'+big_img_link+'" class="svc_big_img"><img class="svc_attachment" src="' + small_img + '" /></a>';
                        },
                        getExternalImageURL: function(image_url, parameter) {
                            image_url = decodeURIComponent(image_url).split(parameter + '=')[1];
                            if (image_url.indexOf('fbcdn-sphotos') === -1) {
                                return image_url.split('&')[0];
                            } else {
                                return image_url;
                            }
                        },
                        getPosts: function(json) {
							if(typeof options.dribbble.loadmore === 'undefined'){
								if(json['page'] != json['pages']){
									$('#social_load_more_btn_'+options.stream_id).attr('data-dribbble',parseInt(json['page'])+1);
								}else{
									$('#social_load_more_btn_'+options.stream_id).attr('data-dribbble','');
								}
							}else{
								if(json['page'] == json['pages']){
									$('#social_load_more_btn_'+options.stream_id).attr('data-dribbble','');
								}else{
									$('#social_load_more_btn_'+options.stream_id).attr('data-dribbble',parseInt(json['page'])+1);
								}
							}
                            if (json['shots']){
								var vc = 0;
                                json['shots'].forEach(function(element) {
									vc++;
                                    var post = new SocialFeedPost('dribbble', Feed.dribbble.utility.unifyPostData(element));
                                    post.render();
                                });
								
								if(json['shots'].length == vc){
									Utility.isotop_loop();	
								}
                            }
                        },
                        unifyPostData: function(element) {
							var ud = element.created_at.replace(" -0400", "");
							ud = ud.replace("/", "-");
							ud = ud.replace("/", "-");
							var yid = element.id;
							//element = element.snippet;
                            var post = {},
                                text = (element.description) ? element.description.replace(/<\/?[^>]+>/gi, '') : element.description.replace(/<\/?[^>]+>/gi, '');
							
                            post.id = yid;
                            post.dt_create = moment(ud,'YYYY-MM-DD hh:mm:ss');
                            post.author_link = element.player.url;
                            post.author_picture = element.player.avatar_url;
                            post.author_name = element.player.name;
                            post.name = element.name || "";
                            post.message = (text) ? text : '';
                            post.description = '';//(element.caption) ? element.caption : '';
                            post.link = element.url
							
                            if (options.show_media === true) {
                                if (element.image_url) {
									small_img = element.image_400_url;
									if(typeof element.image_400_url == 'undefined'){
										small_img = element.image_url;
									}
                                    var attachment = Feed.dribbble.utility.prepareAttachment(element.image_url,small_img);
                                    if (attachment) {
                                        post.attachment = attachment;
                                    }
                                }
                            }
							post.feed = "svc_dribbble";
							
                            return post;
                        }
                    }
                },
                vk: {
                    posts: [],
                    loaded: true,
                    base: 'http://vk.com/',
                    api: 'https://api.vk.com/method/',
                    user_json_template: 'https://api.vk.com/method/' + 'users.get?fields=first_name,%20last_name,%20screen_name,%20photo&uid=',
                    group_json_template: 'https://api.vk.com/method/' + 'groups.getById?fields=first_name,%20last_name,%20screen_name,%20photo&gid=',
                    getData: function(account) {
                        var request_url;
                        switch (account[0]) {
                            case '@':
                                var username = account.substr(1);
                                request_url = Feed.vk.api + 'wall.get?owner_id=' + username + '&filter=' + options.vk.source + '&count=' + options.vk.limit + '&callback=?';
                                Utility.get_request(request_url, Feed.vk.utility.getPosts);
                                break;
                            case '#':
                                var hashtag = account.substr(1);
                                request_url = Feed.vk.api + 'newsfeed.search?q=' + hashtag + '&count=' + options.vk.limit + '&callback=?';
                                Utility.get_request(request_url, Feed.vk.utility.getPosts);
                                break;
                            default:
                        }
                    },
                    utility: {
                        getPosts: function(json) {
                            if (json.response) {
                                $.each(json.response, function() {
                                    if (this != parseInt(this) && this.post_type === 'post') {
                                        var owner_id = (this.owner_id) ? this.owner_id : this.from_id,
                                            vk_wall_owner_url = (owner_id > 0) ? (Feed.vk.user_json_template + owner_id + '&callback=?') : (Feed.vk.group_json_template + (-1) * owner_id + '&callback=?'),
                                            element = this;
                                        Utility.get_request(vk_wall_owner_url, function(wall_owner) {
                                            Feed.vk.utility.unifyPostData(wall_owner, element, json);
                                        });
                                    }
                                });
                            }
                        },
                        unifyPostData: function(wall_owner, element, json) {
                            var post = {};
                            post.id = element.id;
                            post.dt_create = moment.unix(element.date);
                            post.description = ' ';
                            post.message = Utility.stripHTML(element.text);
                            if (options.show_media) {
                                if (element.attachment) {
                                    if (element.attachment.type === 'link')
                                        post.attachment = '<img class="svc_attachment" src="' + element.attachment.link.image_src + '" />';
                                    if (element.attachment.type === 'video')
                                        post.attachment = '<img class="svc_attachment" src="' + element.attachment.video.image_big + '" />';
                                    if (element.attachment.type === 'photo')
                                        post.attachment = '<img class="svc_attachment" src="' + element.attachment.photo.src_big + '" />';
                                }
                            }
                            if (element.from_id > 0) {
                                var vk_user_json = Feed.vk.user_json_template + element.from_id + '&callback=?';
                                Utility.get_request(vk_user_json, function(user_json) {
                                    var vk_post = new SocialFeedPost('vk', Feed.vk.utility.getUser(user_json, post, element, json));
                                    vk_post.render();
                                });
								
                            } else {
                                var vk_group_json = Feed.vk.group_json_template + (-1) * element.from_id + '&callback=?';
                                Utility.get_request(vk_group_json, function(user_json) {
                                    var vk_post = new SocialFeedPost('vk', Feed.vk.utility.getGroup(user_json, post, element, json));
                                    vk_post.render();
                                });
								
                            }
                        },
                        getUser: function(user_json, post, element, json) {
                            post.author_name = user_json.response[0].first_name + ' ' + user_json.response[0].last_name;
                            post.author_picture = user_json.response[0].photo;
                            post.author_link = Feed.vk.base + user_json.response[0].screen_name;
                            post.link = Feed.vk.base + user_json.response[0].screen_name + '?w=wall' + element.from_id + '_' + element.id;
							post.feed = "svc_vk";
                            return post;
                        },
                        getGroup: function(user_json, post, element, json) {
                            post.author_name = user_json.response[0].name;
                            post.author_picture = user_json.response[0].photo;
                            post.author_link = Feed.vk.base + user_json.response[0].screen_name;
                            post.link = Feed.vk.base + user_json.response[0].screen_name + '?w=wall-' + user_json.response[0].gid + '_' + element.id;
                            return post;
                        }
                    }
                },
                blogspot: {
                    loaded: true,
                    getData: function(account) {
                        var url;
                        switch (account[0]) {
                            case '@':
                                var username = account.substr(1);
                                url = 'http://' + username + '.blogspot.com/feeds/posts/default?alt=json-in-script&callback=?';
                                request(url, getPosts);
                                break;
                            default:
                        }
                    },
                    utility: {
                        getPosts: function(json) {
                            $.each(json.feed.entry, function() {
                                var post = {},
                                    element = this;
                                post.id = element.id['$t'].replace(/[^a-z0-9]/gi, '');
                                post.dt_create = moment((element.published['$t']));
                                post.author_link = element.author[0]['uri']['$t'];
                                post.author_picture = 'http:' + element.author[0]['gd$image']['src'];
                                post.author_name = element.author[0]['name']['$t'];
                                post.message = element.title['$t'] + '</br></br>' + stripHTML(element.content['$t']);
                                post.description = '';
                                post.link = element.link.pop().href;
                                if (options.show_media) {
                                    if (element['media$thumbnail']) {
                                        post.attachment = '<img class="svc_attachment" src="' + element['media$thumbnail']['url'] + '" />';
                                    }
                                }
                                post.render();
                            });
                        }
                    }
                }
            };
            // Initialization
        Feed.init();
        if (options.update_period) {
            setInterval(function() {
                return Feed.init();
            }, options.update_period);
        }
    };
})(jQuery);
