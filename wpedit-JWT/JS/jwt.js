/**
 * Functionality to send and receive JWT tokens and perform actions on the REST API.
 *
 * NOT FOR PRODUCTION. PURELY FOR DEMONSTRATION PURPOSES!
 */

const restRoot = 'http://restful.local/wp-json';
const login = document.querySelector( '#loginform' );
const logout = document.querySelector( '#logout' );
const entryTitle = document.querySelector( '.post-title' );
const editToggle = document.querySelector( '.edit-toggle' );
const titleForm = document.querySelector( '#titleform');

// Get token from session storage.
let token = sessionStorage.getItem('newToken');
console.info("Token on load: ", token);

/**
 * Send POST request to the REST API to update the title field.
 * 
 * @param {string} postID   - The current post ID
 * @param {string} newTitle - The new title
 */
function updateTitle( postID, newTitle ) {

    let restURL = `${restRoot}/wp/v2/posts/${postID}`;

    // The request, with authorization headers.
    const response = fetch( restURL, {
        method: 'POST',
        body: JSON.stringify( {
            'title': newTitle
        } ),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem( 'newToken' )
        }
    })
    .then( response => response.json() )
    .then( response => {
        // Toggle various fields on and off, populate the titles of the post and the navigation area.
        document.querySelector( '#title-input' ).value = '';
        titleForm.style.display = 'none';
        editToggle.style.display = 'block';
        entryTitle.innerHTML = response.title.rendered;
        document.querySelector( `.navigation-list a[data-id="${postID}"]` ).innerHTML = response.title.rendered;
    })
    .catch( ( error ) => {
        console.error( 'updateTitle error: ', error );
    });

}

/**
 * Trigger the updateTitle function when the form button is clicked.
 */
function editTitle() {

    titleForm.addEventListener( 'submit', ( event ) => {
        event.preventDefault();
        let postID = document.querySelector('.post').getAttribute('data-id');
        let newTitle = document.querySelector('#title-input').value;
        updateTitle( postID, newTitle );
    });

}

/**
 * Toggles the edit form on when the Edit title button is clicked.
 */
function toggleEditForm() {
    editToggle.addEventListener( 'click', () => {
        editToggle.style.display = 'none';
        titleForm.style.display = 'block';
        editTitle();
    });
}

/**
 * Request JWT token from the REST API using supplied username and password.
 * @param {string} username 
 * @param {string} password 
 */
function getToken( username, password ) {

    let restURL = `${restRoot}/jwt-auth/v1/token`;

    // The POST request to get the token.
    const response = fetch( restURL, {
        method: 'POST',
        body: JSON.stringify( {
            'username': username,
            'password': password
        } ),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then( response => response.json() )
    .then( response => {
        // If we get a token in response (username and password match).
        if ( response.token ) {
            // Toggle various things on and off.
            console.log( 'getToken: ', response.token );
            sessionStorage.setItem('newToken',response.token);
            login.style.display = 'none';
            logout.style.display = 'block';
            editToggle.style.display = 'block';
            toggleEditForm();
        }
    })
    .catch( ( error ) => {
        console.error( 'getToken error: ', error );
    });
 
}

/**
 * Clear token from sessionStorage on logout.
 */
function clearToken() {
    console.log('clearToken!');
    sessionStorage.removeItem('newToken');
    login.style.display = 'block';
    logout.style.display = 'none';
    titleForm.style.display = 'none';
    editToggle.style.display = 'none';
    monitorLogin();
}

/**
 * Monitor interaction with the login form, trigger action on click.
 */
function monitorLogin() {
    if (token === null ) {
        login.style.display = 'block';
        titleForm.style.display = 'none';

        login.addEventListener( 'submit', ( event ) => {
            event.preventDefault();
            let username = document.querySelector('#user_login').value;
            let password = document.querySelector('#user_pass').value;
            console.info(`Username: ${username} Password: ${password}`);
            
            getToken( username, password );
        });

    } else {
        logout.style.display = 'block';
        toggleEditForm();
    }
}

/**
 * Trigger clearToken when logout button is clicked.
 */
logout.addEventListener( 'click', () => {
    clearToken();
});

/**
 * Run the menagerie.
 */
monitorLogin();
