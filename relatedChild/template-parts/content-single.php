<?php
/**
 * Template for displaying single posts.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package WordPress
 * @subpackage TT Child
 * @since 1.0
 */

?>

<article <?php post_class(); ?> id="post-<?php the_ID(); ?>">

	<?php

	get_template_part( 'template-parts/entry-header' );

	get_template_part( 'template-parts/featured-image' );

	?>

	<div class="post-inner <?php echo is_page_template( 'templates/template-full-width.php' ) ? '' : 'thin'; ?> ">

		<div class="entry-content">

			<?php

			the_content( __( 'Continue reading', 'twentytwenty' ) );
			
			?>

		</div><!-- .entry-content -->

	</div><!-- .post-inner -->

	<div class="section-inner">
		<?php
	
		edit_post_link();

		// Single bottom post meta.
		twentytwenty_the_post_meta( get_the_ID(), 'single-bottom' );

		?>

	</div><!-- .section-inner -->
	
	<nav class="related-nav" aria-label="Post" role="navigation">
		<hr class="styled-separator is-style-wide" aria-hidden="true">

			<?php relchild_display_related_posts(); ?>

		<hr class="styled-separator is-style-wide" aria-hidden="true">
	</nav>


	

</article><!-- .post -->
