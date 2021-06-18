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
	
	<nav class="pagination-single section-inner load-previous" aria-label="Post" role="navigation">
		<hr class="styled-separator is-style-wide" aria-hidden="true">

		<div class="pagination-single-inner">
			
			<span class="nav-subtitle">Previous post</span>
			<div class="nav-links">
				<div class="nav-previous">
					<?php $previous_post = get_previous_post(); ?>
					<a href="<?php echo get_permalink($previous_post->ID); ?>" data-id="<?php echo $previous_post->ID; ?>">
						<?php echo $previous_post->post_title; ?>
					</a>
					
				</div>
			</div>
			<div class="js-loader">
				<img src="<?php echo get_theme_file_uri('js/spinner.svg'); ?>" width="32" height="32" />
			</div>
		</div><!-- .pagination-single-inner -->
		<hr class="styled-separator is-style-wide" aria-hidden="true">
	</nav>


	

</article><!-- .post -->
