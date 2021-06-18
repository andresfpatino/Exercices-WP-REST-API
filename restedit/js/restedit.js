// Get data from WordPress
const restURL = postdata.rest_url;
const nonce = postdata.nonce;
const currentID = postdata.current_ID;
console.log( `restULR: ${restURL}, nonce: ${nonce}, currentID: ${currentID}`);

// Get the entry tile element:
const entryTitle = document.querySelector( '.entry-title' );

// Create an "Edit title" button:
const editButton = document.createElement( 'button' );
editButton.className = 'edit-button edit-title';
editButton.innerHTML = 'Edit title';

// Create an "Edit title" form:
const editForm = document.createElement( 'form' );
editForm.id = 'title-edit-form';
editForm.style.display = 'none';
editForm.setAttribute( 'name', 'title-edit-form' );
editForm.innerHTML = `
    <label for="new-title" class="screen-reader-text">New title:</label>
    <input type="text" id="new-title" class="faux-heading" name="newtitle" class="input" value="" size="20"></input>
    <input type="submit" id="save-button" value="Save title"></input>`;

// Append button and form after the title:
entryTitle.after( editButton, editForm );

// Get the form field for future use:
const formField = document.querySelector( '#new-title' );
    
/**
 * Catch the new title from the form field,
 * pass it to the REST API with a request to the current ID route,
 * append the nonce as a header,
 * display the new title in the browser.
 */
const editTitle = () => {

    let currentTitle = entryTitle.innerHTML;
    formField.value = currentTitle;

    editForm.addEventListener( 'submit', ( event ) => {
        event.preventDefault();

        // Build the queryURL for the current post:
        let queryURL = `${restURL}wp/v2/posts/${currentID}`;

        // Send a POST request to the queryURL with the nonce appended:
        const response = fetch( queryURL, {
            method: 'POST',
            body: JSON.stringify( {
                'title': formField.value
            } ),
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': nonce
            }
        })
        .then( response => response.json() )
        .then( response => {
            // Set the title to the new title and display it.
            entryTitle.innerHTML = response.title.rendered;
            entryTitle.style.display = 'block';
            // Hide the edit title form.
            editForm.style.display = 'none';
            editButton.style.display = 'block';
        })
        .catch( ( error ) => {
            console.error( 'getToken error: ', error );
        });
    });
    
};

/**
 * Listen for a click on the "Edit title" button and trigger editTitle().
 */
editButton.addEventListener( 'click', () => {
    // Display the edit form in place of the title.
    editForm.style.display = 'block';
    editButton.style.display = 'none';
    entryTitle.style.display = 'none';
    editTitle();
} );
