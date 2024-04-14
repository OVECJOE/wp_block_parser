import { Gutenizer } from "@/services/tokenizers";

// test gutenizer.ts
const source: string = `<!-- wp:genesis-blocks/gb-testimonial {"testimonialImgID":1035} -->
<div style="background-color:#f2f2f2;color:#32373c" class="wp-block-genesis-blocks-gb-testimonial left-aligned gb-has-avatar gb-font-size-18 gb-block-testimonial"><div class="gb-testimonial-text"><p>Testimonial text</p></div><div class="gb-testimonial-info"><div class="gb-testimonial-avatar-wrap"><div class="gb-testimonial-image-wrap"><img class="gb-testimonial-avatar" src="https://kadence.ducopy.com/wp-content/uploads/2022/07/team-3-150x150.jpeg"/></div></div><h2 class="gb-testimonial-name" style="color:#32373c">Name</h2><small class="gb-testimonial-title" style="color:#32373c">Title</small></div></div>
<!-- /wp:genesis-blocks/gb-testimonial -->

<!-- wp:genesis-blocks/gb-notice {"noticeTitle":"Notice title"} -->
<div style="color:#32373c;background-color:#00d1b2" class="wp-block-genesis-blocks-gb-notice gb-font-size-18 gb-block-notice" data-id="79be6f"><div class="gb-notice-title" style="color:#fff"><p>Notice title</p></div><div class="gb-notice-text" style="border-color:#00d1b2"><p>notice text</p></div></div>
<!-- /wp:genesis-blocks/gb-notice -->

<!-- wp:genesis-blocks/gb-drop-cap -->
<div style="color:#32373c" class="wp-block-genesis-blocks-gb-drop-cap drop-cap-letter gb-font-size-3 gb-block-drop-cap"><div class="gb-drop-cap-text"></div></div>
<!-- /wp:genesis-blocks/gb-drop-cap -->

<!-- wp:genesis-blocks/gb-accordion -->
<div class="wp-block-genesis-blocks-gb-accordion gb-block-accordion"><details><summary class="gb-accordion-title">Accordion title</summary><div class="gb-accordion-text"><!-- wp:paragraph -->
<p>accordion paragraph</p>
<!-- /wp:paragraph --></div></details></div>
<!-- /wp:genesis-blocks/gb-accordion -->

<!-- wp:genesis-blocks/gb-cta {"buttonText":"button text"} -->
<div style="text-align:center" class="wp-block-genesis-blocks-gb-cta gb-block-cta"><div class="gb-cta-content"><h2 class="gb-cta-title gb-font-size-32" style="color:#32373c">Call to Action Title</h2><div class="gb-cta-text gb-font-size-32" style="color:#32373c"><p>Call to action text</p></div></div><div class="gb-cta-button"><a target="_self" rel="noopener noreferrer" class="gb-button gb-button-shape-rounded gb-button-size-medium" style="color:#ffffff;background-color:#3373dc">button text</a></div></div>
<!-- /wp:genesis-blocks/gb-cta -->

<!-- wp:genesis-blocks/gb-sharing {"clientId":"905f2d77-1d22-4431-a1a3-8e55cc20527e"} /-->

<!-- wp:genesis-blocks/gb-pricing -->
<div class="wp-block-genesis-blocks-gb-pricing gb-pricing-columns-2"><div class="gb-pricing-table-wrap gb-block-pricing-table-gap-2"><!-- wp:genesis-blocks/gb-pricing-table -->
<div class="wp-block-genesis-blocks-gb-pricing-table gb-block-pricing-table-center gb-block-pricing-table" itemscope itemtype="http://schema.org/Product"><div class="gb-block-pricing-table-inside" style="border-width:2px;border-style:solid"><!-- wp:genesis-blocks/gb-pricing-table-title {"title":"\u003cstrong\u003ePrice Title\u003c/strong\u003e","fontSize":"medium","paddingTop":30} -->
<div itemprop="name" style="padding-top:30px;padding-right:20px;padding-bottom:10px;padding-left:20px" class="wp-block-genesis-blocks-gb-pricing-table-title gb-pricing-table-title has-medium-font-size"><strong>Price Title</strong></div>
<!-- /wp:genesis-blocks/gb-pricing-table-title -->

<!-- wp:genesis-blocks/gb-pricing-table-subtitle {"subtitle":"Price Subtitle Description","customFontSize":20} -->
<div class="wp-block-genesis-blocks-gb-pricing-table-subtitle gb-pricing-table-subtitle" style="font-size:20px;padding-top:10px;padding-right:20px;padding-bottom:10px;padding-left:20px">Price Subtitle Description</div>
<!-- /wp:genesis-blocks/gb-pricing-table-subtitle -->

<!-- wp:genesis-blocks/gb-pricing-table-price {"price":"49","currency":"$","term":"/mo"} -->
<div class="wp-block-genesis-blocks-gb-pricing-table-price gb-pricing-table-price-wrap gb-pricing-has-currency" style="padding-top:10px;padding-right:20px;padding-bottom:10px;padding-left:20px"><div itemprop="offers" itemscope itemtype="http://schema.org/Offer"><span itemprop="priceCurrency" class="gb-pricing-table-currency" style="font-size:24px">$</span><div itemprop="price" class="gb-pricing-table-price" style="font-size:60px">49</div><span class="gb-pricing-table-term" style="font-size:24px">/mo</span></div></div>
<!-- /wp:genesis-blocks/gb-pricing-table-price -->

<!-- wp:genesis-blocks/gb-pricing-table-features {"customFontSize":20,"paddingTop":15,"paddingBottom":15} -->
<ul itemprop="description" class="wp-block-genesis-blocks-gb-pricing-table-features gb-pricing-table-features gb-list-border-none gb-list-border-width-1" style="font-size:20px;padding-top:15px;padding-right:20px;padding-bottom:15px;padding-left:20px"><li>Product Feature One</li><li>Product Feature Two</li><li>Product Feature Three</li></ul>
<!-- /wp:genesis-blocks/gb-pricing-table-features -->

<!-- wp:genesis-blocks/gb-pricing-table-button {"buttonText":"Buy Now","buttonBackgroundColor":"#272c30","paddingTop":15,"paddingBottom":35} -->
<div class="wp-block-genesis-blocks-gb-pricing-table-button gb-pricing-table-button" style="padding-top:15px;padding-right:20px;padding-bottom:35px;padding-left:20px"><div class="gb-block-button"><a class="gb-button gb-button-shape-rounded gb-button-size-medium" style="color:#ffffff;background-color:#272c30">Buy Now</a></div></div>
<!-- /wp:genesis-blocks/gb-pricing-table-button --></div></div>
<!-- /wp:genesis-blocks/gb-pricing-table -->

<!-- wp:genesis-blocks/gb-pricing-table -->
<div class="wp-block-genesis-blocks-gb-pricing-table gb-block-pricing-table-center gb-block-pricing-table" itemscope itemtype="http://schema.org/Product"><div class="gb-block-pricing-table-inside" style="border-width:2px;border-style:solid"><!-- wp:genesis-blocks/gb-pricing-table-title {"title":"\u003cstrong\u003ePrice Title\u003c/strong\u003e","fontSize":"medium","paddingTop":30} -->
<div itemprop="name" style="padding-top:30px;padding-right:20px;padding-bottom:10px;padding-left:20px" class="wp-block-genesis-blocks-gb-pricing-table-title gb-pricing-table-title has-medium-font-size"><strong>Price Title</strong></div>
<!-- /wp:genesis-blocks/gb-pricing-table-title -->

<!-- wp:genesis-blocks/gb-pricing-table-subtitle {"subtitle":"Price Subtitle Description","customFontSize":20} -->
<div class="wp-block-genesis-blocks-gb-pricing-table-subtitle gb-pricing-table-subtitle" style="font-size:20px;padding-top:10px;padding-right:20px;padding-bottom:10px;padding-left:20px">Price Subtitle Description</div>
<!-- /wp:genesis-blocks/gb-pricing-table-subtitle -->

<!-- wp:genesis-blocks/gb-pricing-table-price {"price":"49","currency":"$","term":"/mo"} -->
<div class="wp-block-genesis-blocks-gb-pricing-table-price gb-pricing-table-price-wrap gb-pricing-has-currency" style="padding-top:10px;padding-right:20px;padding-bottom:10px;padding-left:20px"><div itemprop="offers" itemscope itemtype="http://schema.org/Offer"><span itemprop="priceCurrency" class="gb-pricing-table-currency" style="font-size:24px">$</span><div itemprop="price" class="gb-pricing-table-price" style="font-size:60px">49</div><span class="gb-pricing-table-term" style="font-size:24px">/mo</span></div></div>
<!-- /wp:genesis-blocks/gb-pricing-table-price -->

<!-- wp:genesis-blocks/gb-pricing-table-features {"customFontSize":20,"paddingTop":15,"paddingBottom":15} -->
<ul itemprop="description" class="wp-block-genesis-blocks-gb-pricing-table-features gb-pricing-table-features gb-list-border-none gb-list-border-width-1" style="font-size:20px;padding-top:15px;padding-right:20px;padding-bottom:15px;padding-left:20px"><li>Product Feature One</li><li>Product Feature Two</li><li>Product Feature Three</li></ul>
<!-- /wp:genesis-blocks/gb-pricing-table-features -->

<!-- wp:genesis-blocks/gb-pricing-table-button {"buttonText":"Buy Now","buttonBackgroundColor":"#272c30","paddingTop":15,"paddingBottom":35} -->
<div class="wp-block-genesis-blocks-gb-pricing-table-button gb-pricing-table-button" style="padding-top:15px;padding-right:20px;padding-bottom:35px;padding-left:20px"><div class="gb-block-button"><a class="gb-button gb-button-shape-rounded gb-button-size-medium" style="color:#ffffff;background-color:#272c30">Buy Now</a></div></div>
<!-- /wp:genesis-blocks/gb-pricing-table-button --></div></div>
<!-- /wp:genesis-blocks/gb-pricing-table --></div></div>
<!-- /wp:genesis-blocks/gb-pricing -->

<!-- wp:genesis-blocks/gb-columns {"columns":2,"layout":"gb-2-col-equal","columnsGap":0,"align":"full","paddingTop":6,"paddingRight":1,"paddingBottom":6,"paddingLeft":1,"paddingUnit":"em","customTextColor":"#1f1f1f","customBackgroundColor":"#ffffff","columnMaxWidth":1200,"className":"gb-slate-section-contact-box gpb-slate-section-contact-box "} -->
<div class="wp-block-genesis-blocks-gb-columns gb-slate-section-contact-box gpb-slate-section-contact-box gb-layout-columns-2 gb-2-col-equal gb-has-custom-background-color gb-has-custom-text-color gb-columns-center alignfull" style="padding-top:6em;padding-right:1em;padding-bottom:6em;padding-left:1em;background-color:#ffffff;color:#1f1f1f"><div class="gb-layout-column-wrap gb-block-layout-column-gap-0 gb-is-responsive-column" style="max-width:1200px"><!-- wp:genesis-blocks/gb-column {"customBackgroundColor":"#1f1f1f","customTextColor":"#abb8c3","paddingSync":true,"paddingUnit":"em","padding":3} -->
<div class="wp-block-genesis-blocks-gb-column gb-block-layout-column"><div class="gb-block-layout-column-inner gb-has-custom-background-color gb-has-custom-text-color" style="padding:3em;background-color:#1f1f1f;color:#abb8c3"><!-- wp:heading {"style":{"typography":{"fontSize":40},"color":{"text":"#f5f5f5"}},"gbResponsiveSettings":{}} -->
<h2 class="wp-block-heading has-text-color" style="color:#f5f5f5;font-size:40px">Contact us and let's start building something!</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"color":{"text":"#abb8c3"}}} -->
<p class="has-text-color" style="color:#abb8c3">Use the details to the right to get ahold of us.</p>
<!-- /wp:paragraph -->

<!-- wp:separator {"opacity":"css","className":"is-style-default"} -->
<hr class="wp-block-separator has-css-opacity is-style-default"/>
<!-- /wp:separator -->

<!-- wp:social-links -->
<ul class="wp-block-social-links"><!-- wp:social-link {"url":"https://wordpress.org","service":"wordpress"} /-->

<!-- wp:social-link {"url":"#","service":"facebook"} /-->

<!-- wp:social-link {"url":"#","service":"twitter"} /-->

<!-- wp:social-link {"url":"#","service":"instagram"} /-->

<!-- wp:social-link {"service":"linkedin"} /-->

<!-- wp:social-link {"service":"youtube"} /--></ul>
<!-- /wp:social-links --></div></div>
<!-- /wp:genesis-blocks/gb-column -->

<!-- wp:genesis-blocks/gb-column {"customBackgroundColor":"#006CD8","customTextColor":"#f5f5f5","paddingSync":true,"paddingUnit":"em","padding":3} -->
<div class="wp-block-genesis-blocks-gb-column gb-block-layout-column"><div class="gb-block-layout-column-inner gb-has-custom-background-color gb-has-custom-text-color" style="padding:3em;background-color:#006CD8;color:#f5f5f5"><!-- wp:genesis-blocks/gb-columns {"columns":2,"layout":"gb-2-col-equal"} -->
<div class="wp-block-genesis-blocks-gb-columns gb-layout-columns-2 gb-2-col-equal"><div class="gb-layout-column-wrap gb-block-layout-column-gap-2 gb-is-responsive-column"><!-- wp:genesis-blocks/gb-column -->
<div class="wp-block-genesis-blocks-gb-column gb-block-layout-column"><div class="gb-block-layout-column-inner"><!-- wp:heading {"level":3,"style":{"typography":{"fontSize":26},"color":{"text":"#f5f5f5"}},"gbResponsiveSettings":{}} -->
<h3 class="wp-block-heading has-text-color" style="color:#f5f5f5;font-size:26px">Office</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"color":{"text":"#f5f5f5"}}} -->
<p class="has-text-color" style="color:#f5f5f5">Startup Square<br>123 Block Ave<br>Austin, Texas 36521</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"style":{"typography":{"fontSize":26},"color":{"text":"#f5f5f5"}},"gbResponsiveSettings":{}} -->
<h3 class="wp-block-heading has-text-color" style="color:#f5f5f5;font-size:26px">Hours</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"color":{"text":"#f5f5f5"}}} -->
<p class="has-text-color" style="color:#f5f5f5">Mon-Fri: 8am - 5pm<br>Sat: 8am 9pm<br>Sun: 8am - 2pm</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:genesis-blocks/gb-column -->

<!-- wp:genesis-blocks/gb-column -->
<div class="wp-block-genesis-blocks-gb-column gb-block-layout-column"><div class="gb-block-layout-column-inner"><!-- wp:heading {"level":3,"style":{"typography":{"fontSize":26},"color":{"text":"#f5f5f5"}},"gbResponsiveSettings":{}} -->
<h3 class="wp-block-heading has-text-color" style="color:#f5f5f5;font-size:26px">Via Email</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"color":{"text":"#f5f5f5"}}} -->
<p class="has-text-color" style="color:#f5f5f5">hello@example.com<br>sales@example.com<br>support@example.com</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3,"style":{"typography":{"fontSize":26},"color":{"text":"#f5f5f5"}},"gbResponsiveSettings":{}} -->
<h3 class="wp-block-heading has-text-color" style="color:#f5f5f5;font-size:26px">Via Phone</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"color":{"text":"#f5f5f5"}}} -->
<p class="has-text-color" style="color:#f5f5f5">Tel: 514-281-3821<br>Fax: 514-281-5210</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:genesis-blocks/gb-column --></div></div>
<!-- /wp:genesis-blocks/gb-columns --></div></div>
<!-- /wp:genesis-blocks/gb-column --></div></div>
<!-- /wp:genesis-blocks/gb-columns -->`;

const tokenizer = new Gutenizer(source);
for (const tokens of tokenizer.tokenize()) {
  console.log(tokens);
}
