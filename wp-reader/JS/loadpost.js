/**
 * WP Reader accepts a user-defined URL and tries to obtain
 * the 10 latest posts at the URL location through the WP REST API.
 *
 * NOT FOR PRODUCTION. PURELY FOR DEMONSTRATION PURPOSES!
 */

const siteHeader = document.querySelector( '.site-header' );
const errorPrompt = document.querySelector( '.error' );
const navLoader = document.querySelector( '.nav-loader' );
const navList = document.querySelector( '.navigation-list ul' );
const mainArea = document.querySelector( '.main-area' );


/**
 * Retrieve the featured image and display appropriate markup.
 * 
 * @param {object} postObject - The single post object
 */
function getFeaturedImage( postObject ) {

    // Build HTML output from the embedded featured image info in the postObject.    
    let featuredObject = postObject._embedded['wp:featuredmedia'][0];
    var imgLarge = '';
        var imgWidth = featuredObject.media_details.sizes.full.width;
        var imgHeight = featuredObject.media_details.sizes.full.height;
        if (featuredObject.media_details.sizes.hasOwnProperty("large")) {
            imgLarge = featuredObject.media_details.sizes.large.source_url +  ' 1024w, ';
        }
        featImage = `
            <img src="${featuredObject.media_details.sizes.full.source_url}" 
                    width="${imgWidth}"
                    height="${imgHeight}"
                    alt=""
                    srcset="${featuredObject.media_details.sizes.full.source_url} ${imgWidth}w, ${imgLarge}${featuredObject.media_details.sizes.medium.source_url} 300w"
                    sizes="(max-width: ${imgWidth}) 100vw, ${imgWidth}px">`;
  
      return featImage;
      
  }

/**
 * Build the post for display.
 * 
 * @param {object} postObject - The single post object.
 */
function buildPost( postObject ) {

    // Remove skeleton on first load.
    let skeletons = document.querySelectorAll( '.skeleton' );
    skeletons.forEach( skeleton => {
        skeleton.classList.remove( 'skeleton' );
    });

    // Bring main area up to full opacity again.
    mainArea.classList.remove( 'loading' );

    // Create date object from post date.
    var date = new Date(postObject.date);

    // Prepare a featImgElement variable for the featured image element.
    let featImgElement;
    document.querySelector( '.featured-image' ) ? featImgElement = document.querySelector( '.featured-image' ) : featImgElement = false;

    // If no featured image in the post object...
    if ( 0 === postObject.featured_media ) {
        // ... and there's a featured-image element...
        if ( featImgElement ) { 
            // Remove it.
            featImgElement.remove(); 
        }
    } 
    // If there is a featured image...
    else {
        // ... and a featured-image element...
        if ( featImgElement ) {
            // ... populate the featured image element with new markup.
            featImgElement.innerHTML = getFeaturedImage( postObject );
        }
        // ... and there is no featured-image element... 
        else {
            // make a new featured-image element and populate it with new markup.
            featImgElement = document.createElement( 'figure');
            featImgElement.className = 'featured-image';
            featImgElement.innerHTML = getFeaturedImage( postObject );
            mainArea.prepend( featImgElement );
        }
    }

    // Build the post by replacing content in various elements with new data from the postObject.
    document.querySelector( '.post-title' ).innerHTML = postObject.title.rendered;
    document.querySelector( '.post-author' ).innerHTML = postObject._embedded.author[0].name;
    document.querySelector( '.post-date' ).innerHTML = date.toDateString();
    document.querySelector( '.post-link' ).innerHTML = `<span class="post-link"><a href="${postObject.link}" rel="bookmark">Original source</a></span>`;
    document.querySelector( '.post-content' ).innerHTML = `<div class="post-content">${postObject.content.rendered}</div>`;

    // Remove the spinner in the post list.
    document.querySelector( '.post-loader' ).remove();
    
}

/**
 * Retrieve and display the selected post item.
 * 
 * @param {event} navItem - The clicked node and its event.
 */
function getPost(navItem) {

    // Remove current highlight.
    if ( document.querySelector( '.current' ) ) {
        document.querySelector( '.current' ).classList.remove( 'current' );
    }
    
    // Highlight the current item.
    navItem.className = 'current';

    // Insert a spinner to show loading progress.
    let spinner = document.createElement( 'img' );
    spinner.className = 'post-loader';
    spinner.setAttribute( 'src', 'JS/spinner.svg' );
    navItem.append( spinner );
    
    // Reduce opacity of main area to indicate loading is taking place.
    mainArea.classList.add( 'loading' );

    // Get the URL from the form.
    let rawUrl = new URL(document.querySelector('input[name=raw_url]').value);

    // Build the query URL and try to fetch the selected post.
    let postID = navItem.getAttribute('data-id');
    let queryURL = `${rawUrl.origin}/wp-json/wp/v2/posts/${postID}?_embed`;
    fetch( queryURL )
        .then( response => response.json() )
        .then( postObject => buildPost( postObject ) )
        .catch( (error) => {
            errorPrompt.innerHTML = `Something went wrong. Try again.`;
            console.error('Fetch error:', error);
            // Stop the spinners.
            document.querySelector( '.post-loader' ).remove;
            mainArea.classList.remove( 'loading' );
        });
}

/**
 * Monitor for clicks on the navigation list, then open the relevant post.
 */
function postTrigger() {

    // Get all navigation items.
    let navItems = document.querySelectorAll( '.navigation-list a' );

    // Create eventListener for each navigation item.
    navItems.forEach( navItem => {
        navItem.addEventListener( 'click', () => {
            getPost( navItem );
        });
    });
    
    // Click the first item on the list to load the first article.
    navItems[0].click();
}

/**
 * Turn the list of posts into a navigation list.
 * 
 * @param {object} postObjects - The returned list of posts.
 */
function getPostsList( postObjects ) {

    // Loop through each of the post objects, create a list item with a link for each.
    postObjects.forEach( postObject => {
        let listItem = document.createElement( 'li' );
        listItem.innerHTML = `<a href="javascript:void(0)" data-id="${postObject.id}">${postObject.title.rendered}</a>`;
        navList.append( listItem );
    });

    // Hide the spinner when done.
    navLoader.style.display = "none";
    
    // Call the postTrigger function.
    postTrigger();
}

/**
 * Main function. 
 * + Captures URL from form when "Get Posts" is clicked.
 * + Makes initial call to the REST API.
 */
function getLatestPosts() {

    // Find the query form.
	let queryForm = document.querySelector('#new-url');
    
    // Add an eventlistener to the submit button.
	queryForm.addEventListener( 'submit',  ( event ) => {
        
        // Prevent page from reloading on submit.
        event.preventDefault();

        // Reset the error prompt.
        errorPrompt.innerHTML = '';

        // Clear the previous list.
        navList.innerHTML = '';

        // Start spinner.
        navLoader.style.display = "block";

        // Get the URL from the form.
        let rawUrl = new URL(document.querySelector('input[name=raw_url]').value);
        
        // Build the query URL and try to fetch some JSON.
        let queryURL = `${rawUrl.origin}/wp-json/wp/v2/posts/`;
		fetch( queryURL )
			.then( response => response.json() )
            .then( postObjects => getPostsList( postObjects ) )
            .catch( (error) => {
                errorPrompt.innerHTML = `That didn&rsquo;t work. Try a different URL.`;
                console.error('Fetch error:', error);
                // Stop the spinner.
                navLoader.style.display = "none";
            });
	});
	
}

// Run the whole menagerie.
getLatestPosts();