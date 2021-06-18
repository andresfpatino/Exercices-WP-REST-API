<?php

/**
 * Enqueue Twenty Twenty stylesheet.
 */
add_action( 'wp_enqueue_scripts', 'relchild_enqueue_styles' );
function relchild_enqueue_styles() {
    wp_enqueue_style( 'parent-style', get_template_directory_uri() . '/style.css' );
 
}

/**
 * Display the related posts markup.
 */
function relchild_display_related_posts() {
    printf(
        '<h2 class="nav-subtitle">%s</h2>
         <aside class="related-posts alignfull">
            <div class="related-spinner"></div>
         </aside>',
        esc_html( 'Related posts:', 'wp-rig' )
    );
}

/**
 * Get current post category IDs.
 * 
 * @return string Comma-separated list of category IDs.
 */
function relchild_get_post_category_ids() {
    $categories = get_the_category();
    $cat_ids = [];

    if ( ! empty( $categories ) ) {
        foreach ( $categories as $category ) {
            $cat_ids[] = $category->cat_ID;
        }
    }

    return implode( ',', $cat_ids );
}

/**
 * Enqueue previous post JavaScript.
 */
add_action( 'wp_enqueue_scripts', 'relchild_enqueue_scripts' );
function relchild_enqueue_scripts() {
    if ( is_single() ){
        wp_enqueue_script( 'relchild-js', get_theme_file_uri('js/related.js'), array(), $theme_version, false );

        wp_localize_script( 'relchild-js', 'postdata',
            array(
                'post_ID'   => get_the_ID(),
                'cat_ids'   => relchild_get_post_category_ids(),
                'rest_url'  => rest_url( 'wp/v2/' ),
            )
        );
    }
}