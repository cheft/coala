```html
<div class="title">那些年我们一起玩过的Web框架</div>
<ul>
	{{~data.resource :item}}
	<li>
		<a href="{{=item.url}}">{{=item.name}}</a>
		<span>{{=item.url}}</span>
	</li>
	{{~}}
</ul>
<button class="rotate-btn" id="rotate">猛点瞅一瞅</button>

<script>
module.exports = {
	data: function() {
		return $.get('docs/assets/frameworks.json')
	},
	events: {
		'click #rotate': 'rotateLinks'
	},
	handle: {
		rotateLinks: function() {
			this.data.resource = this.data.resource.reverse()
			this.update()
		}
	}
}
</script>
```
