{{- $site := . -}}
{{- $p := $site.Params.prefix -}}
{{- $bn := print $p "globalHeader" -}}

/**
 * {{ $bn }} - Functions for the nav block: show/hide submenus, show login info, etc.
 */ 
(function( {{ $bn }}, undefined ) {

    var block = {{ $bn }};
  
    const
        // The full url to the DataONE instance of MetacatUI
        urlMCUI = "{{- $site.Params.links.search | default `https://search.dataone.org` -}}",
        // The full url for the Hugo website
        baseUrl = "{{- $site.BaseURL | default `https://www.dataone.org` -}}",
        // An ID for the iframe that we will create temporarily
        iframeId = "tempIframeId",
        // Check if this script is running from within an iframe, and if the parent is the Hugo website
        inIframe = (function(){ try{ return window.self !== window.top; } catch (e) { return true } })(),
        // Checks if the referrer matches the Hugo website's base URL
        referrerIsWebsite = document.referrer ? new URL(document.referrer).origin.replace(/\/$/, "") === baseUrl.replace(/\/$/, "") : true,
        // Check if this script is running from within an iframe, and if the parent is the Hugo website
        inWebsiteIframe = inIframe && referrerIsWebsite,
        // If there is a MetacatUI variable, then this JS is running on the MetacatUI website (or iframe)
        isMCUI = typeof MetacatUI !== 'undefined',
        // The selector for the element that contains text (link name) in the submenu links
        subLinkTextSelector = ".{{ $p }}menu-item__sub-item-name";
        
    var lastScroll = 0,
        closeDropdownTimeout = 0;

  /**  
   * initialize - Function to run once the navbar elements are loaded.
   * Select the elements that we need for other functions and set listeners.
   * Get user data and update the user profile menu & sub-menu
   */   
  block.initialize = function(){
    // When this script is in an iFrame and is within a MetacatUI environment
    if(inWebsiteIframe && isMCUI){
      // Send a message to the parent, where the parent is the Hugo website.
      // The message contains the data we need to update the profile menu
      window.parent.postMessage(JSON.stringify(extractUserData(MetacatUI)), baseUrl);
      // Don't do anything else if this is just a MetacatUI iFrame
      return
    }
    selectElements();
    setListeners();
    // Check if user data extracted from MetacatUI is already in local storage. 
    // If it is, update the menu right away.
    if( getUserData()){
      updateProfileMenu()
    }
    // If this script is in MetacatUI, but not in an iFrame
    if(isMCUI){
      saveUserData(extractUserData(MetacatUI));
      updateProfileMenu();
    // If this script is in the Hugo website
    } else {
      // Listen to messages from the MetacatUI iframe, where we'll get the data
      // needed to update the profile menu
      window.removeEventListener('message', receiveMessage, false);
      window.addEventListener('message', receiveMessage, false);
      addIframe();
    }
  }

  /**  
   * selectElements - Select all of the elements that will be updated, make them
   * accessible to other functions
   */   
  const selectElements = function(){
    // Select elements that we will manipulate
    // The menu button, menu, and nav
    block.menuButton    = document.getElementById("global-menu-toggle");
    block.menu          = document.getElementById("global-menu");
    block.header        = document.getElementById("nav");
    
    // The signin and profile menu items
    block.signin     = document.querySelector(".{{ $p }}menu-item--sign-in");
    block.profile    = document.querySelector(".{{ $p }}menu-item--profile");
    
    // Save the default term used in the parent of the profile menu, so we can
    // replace it in case there is no username / fullname
    block.profileText   = block.profile.querySelector(".{{ $p }}menu-item__top-item-name");
    block.profileTerm   = block.profileText.innerHTML;
    
    // Get the dropdown buttons with corresponding submenus
    block.dropdownEls = [];
    document.querySelectorAll(".{{ $p }}menu-item--dropdown").forEach((container, i) => {
      {{ $bn }}.dropdownEls[i] = {
        container : container,
        button    : container.querySelector("button"),
        submenu   : container.querySelector(".{{ $p }}menu-item__sub-menu")
      }
    });
    
    // Save the text and hrefs in the profile menu so that we can reset it later, if needed    
    block.profileLinkEls = [];
    block.profile.querySelectorAll("a").forEach((link, i) => {
      const textEl = link.querySelector(subLinkTextSelector);
      block.profileLinkEls[i] = {
        el: link,
        textEl: textEl,
        originalHref: link.getAttribute("href"),
        // originalHTML: textEl.innerHTML,
        originalDisplay: link.style.display
      }
    });
  }
  
  /**  
   * addIframe - Create an iFrame with the MetacatUI website inside.
   * We use this iFrame to get a message from MetacatUI with user data.
   */   
  const addIframe = function(){
    // Load an iframe to get the data from MetacatUI
    const iframe = document.createElement('iframe');
    // Use the about page since it's empty, it should take less time to load
    iframe.setAttribute('src', urlMCUI + "/about");
    iframe.setAttribute('id', iframeId);
    // Make sure it's not visible
    iframe.style.display = 'none';
    iframe.style.width = 0 + 'px';
    iframe.style.height = 0 + 'px';
    // Insert it at the end of the body
    document.body.appendChild(iframe);
  }
  
  /**  
   * receiveMessage - function to run when a message is received from the
   * metacatUI iFrame. Checks the origin of the message, then saves the data
   * and updates the profile menu.
   *    
   * @param  {event} e 
   */   
  const receiveMessage = function(e) {
    // Ignore messages from any source except the DataONE metacatUI
    if(e.origin !== urlMCUI){ return }
    saveUserData(e.data);
    updateProfileMenu();
    // // Remove the iframe
    // const iframe = document.getElementById(iframeId);
    // if(iframe){  iframe.parentNode.removeChild(iframe) }
    // // Remove this listener
    // e.currentTarget.removeEventListener(e.type, receiveMessage);
  }
  
  /**  
   * extractUserData - Given the MetacatUI app object, gets the necessary data
   * to update the user profile menu item.
   *    
   * @param  {Object} MetacatUI description   
   * @return {Object}           an object the indicated whether the use is logged in, their user name, formatted name, and whether or not to show a link to the "my portals" page on MetacatUI 
   */   
  const extractUserData = function(MetacatUI){
    return {
      loggedin: MetacatUI.appUserModel.get("loggedIn"),
      username: MetacatUI.appUserModel.get('username'),
      name: MetacatUI.appUserModel.get('fullName') ? MetacatUI.appUserModel.get('fullName').charAt(0).toUpperCase() + MetacatUI.appUserModel.get("fullName").substring(1) : MetacatUI.appUserModel.get("username"),
      showPortals: MetacatUI.appModel.get("showMyPortals") !== false && MetacatUI.appModel.get("enableUserProfiles") && MetacatUI.appModel.get("enableUserProfileSettings")
    }
  }
  
  /**  
   * const getUserData - retrieves the data saved by saveUserData function and parses it.
   *    
   * @return {Object}  the parsed MetacatUI user data. Returns false if no data was found.
   */   
  const getUserData = function(){
    const storedData = localStorage.getItem("metacatuiData");
    if(storedData){
      return JSON.parse(storedData);
    } else {
      return false
    }
  }
  
  /**  
   * const saveUserData - stringifies data if needed and saves it be retrieved later with the getUserData function.
   *    
   * @param  {string|Object} data The data to save
   */   
  const saveUserData = function(data){
    if(data){
      if(!(typeof data === 'string' || data instanceof String)){
        data = JSON.stringify(data)
      }
      localStorage.setItem("metacatuiData", data);
    }
  }
  
  /**  
   * resetProfileMenu - Remove any user-specific attributes from the profile
   * menu, hide it, and show the sign in button instead.
   */   
  const resetProfileMenu = function(){
    // Remove the user name and set it back to whatever it was initially set to
    block.profileText.innerHTML = block.profileTerm;
    // Show the signin menu, hide the profile menu
    showMenu(block.signin);
    hideMenu(block.profile);
    // Set all the links to their original hrefs and displays
    if(!block.profileLinkEls){ return }
    // Set the profile sublinks to their original values
    block.profileLinkEls.forEach((link, i) => {
      link.el.href = link.originalHref;
      link.el.style.display = link.originalDisplay;
      // link.textEl.innerHTML = link.originalHTML
    });
  }

  /**
   * updateProfileMenu - show the user profile navigation, update the text
   * to show the user's name, and update the links to go to the user's profile.
   */   
  const updateProfileMenu = function(){
    
    if(!block.profile){
      console.warn("Couldn't update profile menu in the navigation bar because the menu element was missing.");
      return
    }
    resetProfileMenu();
    const data = getUserData();
    if(!data){
      console.warn("Couldn't update profile menu in the navigation bar because the user data was missing.");
      return
    }
    if(data.loggedin){
      if(data.name){
        block.profileText.innerHTML = data.name
      }
      showMenu(block.profile);
      hideMenu(block.signin);
      // Change the button links to user profile
      block.profileLinkEls.forEach((link, i) => {
        
        link.el.href = link.el.href
          .replace(/^.*?SEARCH/, urlMCUI)
          .replace(/USERNAME/, data.username);
        
        if(link.el.title.toLowerCase() === "my profile") {
          if(!data.showPortals){
            link.el.display = "none"
          }
        }
      });
    }
  }

  /**  
   * showMenu - unhide a menu item in the nav
   *    
   * @param  {HTMLElement} menuEl The menu element to show
   */   
  const showMenu = function(menuEl){
    if(!menuEl) return;
    menuEl.style.display = "block";
  }
  
  /**  
   * hideMenu - hide a menu item in the nav
   *    
   * @param  {HTMLElement} menuEl The menu element to hide
   */   
  const hideMenu = function(menuEl){
    if(!menuEl) return;
    menuEl.style.display = "none";
  }
  
  /**
   * closeAllDropdowns - Closes all the submenus
   */ 
  const closeAllDropdowns = function(){
    if(block.dropdownEls){
      block.dropdownEls.forEach( els  => {
        d1Utilities.toggleElement(els.button, els.submenu, true);
      });
    }  
  }

  /**  
   * stopCloseTimeout - Helps time when the menu should close
   */
  const startCloseTimeout = function (){
    closeDropdownTimeout = setTimeout( () => closeAllDropdowns() , 70 );
  }; 

  /**  
   * stopCloseTimeout - Helps time when the menu should close
   */
  const stopCloseTimeout   = function () {
    clearTimeout( closeDropdownTimeout );
  };

  /**
   * dropdownMouseenter - Handler function for when the mouse enters
   * the dropdown menu container
   */ 
  const dropdownMouseenter = function(els){
    if(!d1Utilities.isMobile()){
      stopCloseTimeout();
      // ensure other dropdowns are closed
      closeAllDropdowns();
      // open the corresponding submenu
      d1Utilities.toggleElement(els.button, els.submenu, false );
    }
  }

  /**
   * dropdownMouseleave - Handler function for when the mouse leaves
   * the dropdown menu container
   */ 
  const dropdownMouseleave = function(){
    if(!d1Utilities.isMobile()){
      startCloseTimeout()
    }
  }

  /**
   * dropdownClick - Handler function for when a dropdown menu container is
   * clicked.
   */ 
  const dropdownClick = function(els){
    if(d1Utilities.isMobile()){
      // check if opened or closed currently
      var open = JSON.parse(els.button.getAttribute("aria-expanded"));
      // ensure other dropdowns are closed
      closeAllDropdowns();
      // toggle the corresponding submenu
      d1Utilities.toggleElement(els.button, els.submenu, open);
    }
  }

  /**
   * menuButtonClick - Handler function for when a menu button is
   * clicked.
   */ 
  const menuButtonClick = function () {
    if(d1Utilities.isMobile()){
      var open = JSON.parse(block.menuButton.getAttribute("aria-expanded"));
      d1Utilities.toggleElement(block.menuButton, block.menu, open);
      // Menu and search shouldn't be open at the same time.
      // d1Utilities.toggleElement(searchButton, search, true);
      // Close all the dropdowns on menu close or open
      closeAllDropdowns();
    }
  };


  /**
   * searchButtonClick - Handler function for when a search button is
   * clicked.
   */ 
  // var searchButtonClick = function () {
  //   if(searchExists){
  //     var open = JSON.parse(searchButton.getAttribute("aria-expanded"));
  //     d1Utilities.toggleElement(searchButton, search, open);
  //     // TODO: this only works on chrome. On safari/firefox, causes menu to stay open
  //     // if((!open) && searchInput){
  //     //   searchInput.focus();
  //     // };
  //     if(d1Utilities.isMobile()){
  //       d1Utilities.toggleElement(block.menuButton, block.menu, true);
  //     }
  //   } else {
  //     // We don't put the search bar in the nav when on the homepage,
  //     // since the homepage has it's own search bar. Scroll to homepage
  //     // search in this case.
  //     if(searchInput){
  //       searchInput.scrollIntoView({ behavior: "smooth", block:'center' });
  //       searchInput.focus();
  //       if(d1Utilities.isMobile()){
  //         d1Utilities.toggleElement(block.menuButton, block.menu, true);
  //       }
  //     }
  //   }
  //
  // };

  /**
   * searchFocusout - handler for when a search input losses focus
   *  
   * @param  {event} event The focus out event
   */ 
  // var searchFocusout = function (event) {
  //   // event.relatedTarget gets the object that triggered the focusout event,
  //   // and if it's the submit submit button, ignore the focusout event.
  //   // Otherwise the submit function does not work.
  //   // Also ignore the event if it's the toggle button, since this already
  //   // has an open/close function attached to it.
  //   if(event.relatedTarget && (
  //       event.relatedTarget.getAttribute('type') == "submit" ||
  //       event.relatedTarget == searchButton
  //     )
  //   ){
  //     event.preventDefault();
  //   } else {
  //     d1Utilities.toggleElement(searchButton, search, true);
  //   }
  // }

  /**
   * toggleHeader - Show/hides the menu (if mobile)
   */ 
  block.toggleHeader = function(){
    if(!block.header || !d1Utilities.isMobile()){
      return
    }
    const currentScroll = window.pageYOffset;
    
    var currentScrollPos = window.pageYOffset;
    if (currentScroll == 0) {
      block.header.style.bottom = "0";
      return
    }
    if(currentScroll > lastScroll) {
      block.header.style.bottom = "-63px";
      d1Utilities.toggleElement(block.menuButton, block.menu, true);
    } else if ( currentScroll < lastScroll ) {
      block.header.style.bottom = "0";
    }
    lastScroll = currentScrollPos;
  }
  
  /**  
   * setListeners - Set the listeners for the navbar
   */   
  const setListeners = function(){
    
    // Make sure the aria labels are set to visible when the page is on desktop mode
    window.removeEventListener("load", function(e){if(!d1Utilities.isMobile()) {  d1Utilities.toggleElement(block.menuButton, block.menu, false)} }, false);
    window.addEventListener("load", function(e){if(!d1Utilities.isMobile()) {  d1Utilities.toggleElement(block.menuButton, block.menu, false)} }, false);
    
    // Hide the entire header on scroll down, show on scroll up. (on mobile)
    window.addEventListener("scroll", d1Utilities.throttle(block.toggleHeader, 100));
    
    // Show/hide the dropdown menus
    block.dropdownEls.forEach( els  => {
      
      // Mouse enter event (desktop version only)
      els.container.removeEventListener("mouseenter", function(){dropdownMouseenter(els)}, false);
      els.container.addEventListener("mouseenter", function(){ dropdownMouseenter(els)}, false);
      
      // Mouse leave event (desktop version only)
      els.container.removeEventListener("mouseleave", function(){dropdownMouseleave(els)}, false);
    	els.container.addEventListener("mouseleave", function(){dropdownMouseleave(els)}, false);
      
      // Click event (mobile version only)
      els.container.removeEventListener("click", function(){dropdownClick(els)}, false);
      els.container.addEventListener("click", function(){dropdownClick(els)}, false);
      
    });

    // Show/hide the menu when the menu-toggle button is clicked
    if(block.menu !== null && block.menuButton !== null){
      block.menuButton.removeEventListener("click", menuButtonClick);
      block.menuButton.addEventListener("click", menuButtonClick);
    }

    // if(searchButton){
    //   // Show/hide the search when the search-toggle button is clicked, or if on the
    //   // homepage, scroll to the search at the top of the page and put it in focus.
    //   searchButton.removeEventListener("click", searchButtonClick);
    //   searchButton.addEventListener("click", searchButtonClick);
    // 
    //   // Close the search on focus out event.
    //   if(searchExists){
    //     search.removeEventListener("focusout", searchFocusout, true);
    //     search.addEventListener("focusout", searchFocusout, true);
    //   }
    // }
  }

}( window.{{ $bn }} = window.{{ $bn }} || {} ));
