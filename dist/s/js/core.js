function is_ie() {
	var ua = window.navigator.userAgent, ie = ua.indexOf("MSIE ");
	
	if (ie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))
		return true;
	return false;
}

if (!is_ie()) {
	document.documentElement.className = document.documentElement.className.replace(/(^|\s)rt-njs(\s|$)/,"$1rt$2");

	(function(d, w) {
		var EXPANDED = 'expanded';
		var COLLAPSED = 'collapsed';
		
		/**
			* Wrapping up some default event functions
			*/

		var $ = {
			on: function(element, event, callback) {
				if (element) {
					element.addEventListener(event, callback, false);
				}
			},

			setEvent: function (element, event, callback, set) {
				if (set === true ) {
					element.addEventListener(event, callback, false);
				} else {
					element.removeEventListener(event, callback, false);
				}
			}
		};

		/**
			* Constructing the object
			*/

		var App = {
			body: d.querySelector('.body'),
			hire: {
				button: d.getElementById('hire-btn'),
				body: d.getElementById('hire-me')
			},

			pageTitle: d.title,
			navItems: undefined,

			/**
				* Gets the page's body element using the title
				*/
			getPageBodyByTitle: function (title) {
				var paragraphs = d.querySelectorAll('.page'),
						element = undefined,
						attr;

				for (var i = 0, j = paragraphs.length; i < j; i++) {
					attr = paragraphs[i].getAttribute('data-for');

					if (attr === title) {
						element = paragraphs[i];
					}
				}

				return element;
			},

			togglePage: function (title) {
				if (App.page !== undefined) {
					App.page.classList.toggle('visible');

					var visibility = App.page.classList.contains('visible'),
							backButton = App.page.querySelector('.page-close');

					if (!visibility && App.navItem.classList.contains(EXPANDED)) {
						App.navItem.classList.replace(EXPANDED, COLLAPSED);
					}

					App.body.style.overflow = visibility ? 'hidden' : 'initial';
					d.title = visibility ? App.pageTitle + ' - ' + title : App.pageTitle;
					
					return $.setEvent(backButton, 'click', App.togglePage, visibility);
				}
			},

			onNavClick: function (body) {
				var title = body.id, state = body.classList.contains(COLLAPSED);
				
				body.classList.replace((state) ? COLLAPSED : EXPANDED, (state) ? EXPANDED : COLLAPSED);

				App.navItem = body;
				App.page = App.getPageBodyByTitle(title);
				
				return App.togglePage(title);
			},

			toggleDropbox: function() {
				App.hire.button.classList.toggle('active');
				App.hire.body.classList.toggle('active');
			},

			dropboxEventCheck: function(e) {
				if (e.target == App.hire.button || !App.hire.body.classList.contains('active'))
					return;
				
				var inner = App.hire.body.querySelector('.dropbox-body-inner');

				if (e.target != inner) {
					var child = inner.childNodes;

					switch (e.target) {
						case child[1]:
						case child[3]:
						case child[5]: {
							return;
							break;
						}

						default: {
							App.toggleDropbox();
							break;
						}
					}
				}
			}
		};


		/**
			* Toggle the page when the link in the
			* navbar is clicked
			*/

		var navLink = d.querySelectorAll('.nav-link');

		for (var i = 0; i < navLink.length; i++) {
			$.on(navLink[i], 'click', function(e) {
				e.preventDefault();

				return App.onNavClick(this), false;
			});
		};

		/**
			* Toggle the hire dropbox when the
			* hire me button is clicked
			*/

		$.on(App.hire.button, 'click', function() {
			return App.toggleDropbox();
		});

		/**
			* If the dropbox is toggled and the user clicks
			* outside of the dropbox area, hide it
			*
			*
			* If touch event exists (for any touchscreen devices), use the touchstart even
			* else, use the click event for mouse click
			*/
		var clickEvent = ('ontouchstart' in d.documentElement) ? 'touchend' : 'click';
		
		$.on(w, clickEvent, function(e) {
			return App.dropboxEventCheck(e);
		});

		/**
			* Set the display of the hire me element
			* on page load, to avoid animation bug
			*/

		$.on(w, 'load', function() {
			App.hire.body.style.display = 'block';
		});
	})(document, window);
}