/**
 * Request the previous post (when available) using the REST API.
 * Trigger auto-load on scroll with click as fallback.
 */

/**
 * Variables from WordPress, passed using wp_localize_script():
 * theme_uri - URI to the theme folder for TT Child.
 * rest_url  - URL for the REST API root route. 
 */
const themeURI = postdata.theme_uri;
const restURL = postdata.rest_url;

// When JavaScript is enabled, change the link to a JS trigger.
document.querySelector('.load-previous a').setAttribute( 'href', 'javascript:void(0)');

/**
 * Get the current category IDs and request their category objects.
 * @param  {object} postObject - The entire post object
 * @param  {bool}   isCat      - Is the query a category (true) or a tag (false)
 * @return {string} termLinks  - String of HTML for either list of categories or list of tags 
 */
function getTaxonomies( postObject, isCat ) {

	let termLinks = [];
	let taxArray;
	if ( isCat ) {
		taxArray = postObject._embedded['wp:term'][0];
	} else {
		taxArray = postObject._embedded['wp:term'][1];
	}
	for ( let term of taxArray ) {
		termLinks.push(`<a href="${term.link}" rel="${isCat ? 'category' : ''} tag">${term.name}</a>`);
	}

	termLinks = isCat ? termLinks.join('') : termLinks.join(', ');

	return termLinks;

}

/**
 * Get the featured image if it exists. 
 * @param  {object} postObject - The entire post object
 */
function getFeaturedImage( postObject ) {

  // If there is no featured image, exit the function returning nothing.
  if ( 0 === postObject.featured_media ) {
	return '';
  } else {
	let featuredObject = postObject._embedded['wp:featuredmedia'][0];
	var imgLarge = '';
		var imgWidth = featuredObject.media_details.sizes.full.width;
		var imgHeight = featuredObject.media_details.sizes.full.height;
		if (featuredObject.media_details.sizes.hasOwnProperty("large")) {
			imgLarge = featuredObject.media_details.sizes.large.source_url +  ' 1024w, ';
		}
		featImage = `
			<figure class="featured-media">
				<div class="featured-media-inner section-inner">
					<img class="attachment-post-thumbnail size-post-thumbnail wp-post-image" 
               src="${featuredObject.media_details.sizes.full.source_url}" 
               width="${imgWidth}"
               height="${imgHeight}"
               alt=""
               srcset="${featuredObject.media_details.sizes.full.source_url} ${imgWidth}w, ${imgLarge}${featuredObject.media_details.sizes.medium.source_url} 300w"
               sizes="(max-width: ${imgWidth}) 100vw, ${imgWidth}px">
				</div><!-- .featured-media-inner -->

			</figure>`
	}

	return featImage;
	
}
/**
 * Builds out the HTML of the new post.
 * @param {object} postObject - modified post object with available term lists added
 */
function buildNewPost( postObject ) {

	// Only output tag markup if there are actual tags for the post.
	let conditionalTags = ( postObject ) => {

		let tagMarkup = '';

		if (postObject.tagLinks !== '') {
			tagMarkup = `
				<div class="post-meta-wrapper post-meta-single post-meta-single-bottom">

					<ul class="post-meta">

						<li class="post-tags meta-wrapper">
							<span class="meta-icon">
								<span class="screen-reader-text">Tags</span>
								<svg class="svg-icon" aria-hidden="true" role="img" focusable="false" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path fill="" d="M15.4496399,8.42490555 L8.66109799,1.63636364 L1.63636364,1.63636364 L1.63636364,8.66081885 L8.42522727,15.44178 C8.57869221,15.5954158 8.78693789,15.6817418 9.00409091,15.6817418 C9.22124393,15.6817418 9.42948961,15.5954158 9.58327627,15.4414581 L15.4486339,9.57610048 C15.7651495,9.25692435 15.7649133,8.74206554 15.4496399,8.42490555 Z M16.6084423,10.7304545 L10.7406818,16.59822 C10.280287,17.0591273 9.65554997,17.3181054 9.00409091,17.3181054 C8.35263185,17.3181054 7.72789481,17.0591273 7.26815877,16.5988788 L0.239976954,9.57887876 C0.0863319284,9.4254126 0,9.21716044 0,9 L0,0.818181818 C0,0.366312477 0.366312477,0 0.818181818,0 L9,0 C9.21699531,0 9.42510306,0.0862010512 9.57854191,0.239639906 L16.6084423,7.26954545 C17.5601275,8.22691012 17.5601275,9.77308988 16.6084423,10.7304545 Z M5,6 C4.44771525,6 4,5.55228475 4,5 C4,4.44771525 4.44771525,4 5,4 C5.55228475,4 6,4.44771525 6,5 C6,5.55228475 5.55228475,6 5,6 Z"></path></svg>						
							</span>
							<span class="meta-text">
								${getTaxonomies( postObject, false )}						
							</span>
						</li>
							
					</ul><!-- .post-meta -->

				</div>`;
		}   
		
		return tagMarkup;
	}

	let output = `
	<hr class="styled-separator is-style-wide" aria-hidden="true">
		<header class="entry-header has-text-align-center header-footer-group">

		  <div class="entry-header-inner section-inner medium">
	
				<div class="entry-categories">
					<span class="screen-reader-text">Categories</span>
					<div class="entry-categories-inner">
						${getTaxonomies( postObject, true )}
					</div><!-- .entry-categories-inner -->

				</div><!-- .entry-categories -->

				<h2 class="entry-title"><a href="${postObject.link}">${postObject.title.rendered}</a></h2>
			</div>
		</header>

    ${getFeaturedImage( postObject )}
    
    <div class="post-inner thin ">
      <div class="entry-content">
        ${postObject.content.rendered}
      </div>
    </div>

		${conditionalTags( postObject )}

	<nav class="pagination-single section-inner load-previous ${postObject.previous_post_ID}" aria-label="Post" role="navigation">
	<hr class="styled-separator is-style-wide" aria-hidden="true">

	<div class="pagination-single-inner">
	  
	  <span class="nav-subtitle">Previous post</span>
	  <div class="nav-links">
		<div class="nav-previous">
					<a href="javascript:void(0)" data-id="${postObject.previous_post_ID}">
						${postObject.previous_post_title}
		  </a>
		  
		</div>
	  </div>
	  <div class="js-loader">
		<img src="${themeURI}/js/spinner.svg" width="32" height="32">
	  </div>
	</div><!-- .pagination-single-inner -->
	<hr class="styled-separator is-style-wide" aria-hidden="true">
	</nav>
  
	`;

	// Remove "load previous" container.
	document.querySelector('.load-previous').remove();

	// Create a article with appropriate classes to populate.
  let postElement = document.createElement( 'article' );
	postElement.className = 'post type-post format-standard hentry';
	postElement.innerHTML = output;
	
	// Append new article with all content to the bottom of the main element.
	document.querySelector( '#site-content article').append(postElement);

	getPreviousPost();
}

// Get previous post
const getPreviousPost = () => {
	let previousPostTrigger = document.querySelector('.load-previous a');
	
	previousPostTrigger.addEventListener( 'click', () => {
   		document.querySelector( '.js-loader' ).style.display = "block";
		let queryURL = `${restURL}posts/${previousPostTrigger.getAttribute( 'data-id' )}?_embed`;
		fetch( queryURL )
			.then( response => response.json() )
			.then( postObject => buildNewPost( postObject ) );
	});
	
}

getPreviousPost();
