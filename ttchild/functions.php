<?php

/**
 * Enqueue Twenty Twenty stylesheet.
 */
add_action( 'wp_enqueue_scripts', 'ttchild_enqueue_styles' );
function ttchild_enqueue_styles() {
    wp_enqueue_style( 'parent-style', get_template_directory_uri() . '/style.css' );
 
}

/**
 * Add fields to the REST API response
 */

add_action( 'rest_api_init', 'ttchild_register_fields' );
function ttchild_register_fields() {
    register_rest_field( 'post',
        'previous_post_ID',
        array(
            'get_callback'    => 'ttchild_get_previous_post_ID',
            'update_callback' => null,
            'schema'          => null,
        )
    );
    register_rest_field( 'post',
        'previous_post_title',
        array(
            'get_callback'    => 'ttchild_get_previous_post_title',
            'update_callback' => null,
            'schema'          => null,
        )
    );
    register_rest_field( 'post',
        'previous_post_link',
        array(
            'get_callback'    => 'ttchild_get_previous_post_link',
            'update_callback' => null,
            'schema'          => null,
        )
    );
}

function ttchild_get_previous_post_ID() {
    return get_previous_post()->ID;
}

function ttchild_get_previous_post_title() {
    return get_previous_post()->post_title;
}

function ttchild_get_previous_post_link() {
    return get_permalink( get_previous_post()->ID );
}

/**
 * Enqueue previous post JavaScript.
 */
add_action( 'wp_enqueue_scripts', 'ttchild_enqueue_scripts' );
function ttchild_enqueue_scripts() {
    if ( is_single() ){
        wp_enqueue_script( 'ttchild-js', get_theme_file_uri('js/previous.js'), array(), $theme_version, false );
        wp_script_add_data( 'ttchild-js', 'defer', true );
        wp_script_add_data( 'ttchild-js', 'type', 'module');

        wp_localize_script( 'ttchild-js', 'postdata',
            array(
                'theme_uri' => get_stylesheet_directory_uri(),
                'rest_url' => rest_url('wp/v2/'),
            )
        );
    }
}