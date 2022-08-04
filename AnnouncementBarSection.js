/* ==========
 * Custom Announcement Bar
 * This Code is licensed by Will-Myers.com 
========== */
(function(){  
  const aBDropzone = document.querySelector('.sqs-announcement-bar-dropzone'),
        section = document.querySelector('#footer-sections [data-wm-plugin="announcement-bar-section"]')?.closest('.page-section');

  //Hide Section in Footer
  section?.classList.add('footer-announcement-bar-section');

  function moveSection() {
    let aBar = aBDropzone.querySelector('.sqs-announcement-bar'),
        innerTextEl = aBar.querySelector('#announcement-bar-text-inner-id'),
        container = aBar.querySelector('.sqs-announcement-bar-text'),
        sectionClone = section.cloneNode(true),
        codeBlock =  sectionClone.querySelector('[data-wm-plugin="announcement-bar-section"]').closest('.sqs-block');
    
    codeBlock.classList.add('hide-block')
    aBDropzone.classList.add('wm-custom-announcement-bar', 'loaded');
    container.append(sectionClone);
    container.querySelector('.content-wrapper > .content').prepend(innerTextEl);
    sectionClone.classList.add('announcement-bar-section');
    sectionClone.classList.remove('footer-announcement-bar-section');

    function loadPluginImages() {
      let images = container.querySelectorAll('.summary-v2-block img, .sqs-block-image img, .section-background img');
      images.forEach(img => {

        img.classList.add('loaded');
        let imgData = img.dataset,
            focalPoint = imgData.imageFocalPoint,
            parentRation = imgData.parentRatio,
            src = img.src;
        if (focalPoint) {
          let x = focalPoint.split(',')[0] * 100,
              y = focalPoint.split(',')[1] * 100;
          img.style.setProperty('--position', `${x}% ${y}%`)
        }
        if (!src) {
          img.src = imgData.src
        }
      });
    }
    loadPluginImages();
    
    //Global Init
    Squarespace.Squarespace.initializeLayoutBlocks(Y)
  }

  /** 
  * Mutation Observer
  * Added Section to Announcement Bar
  * When elements get add to Annoucement Bar
  **/
  const observer = new MutationObserver(function(mutations_list) {
    mutations_list.forEach(function(mutation) {
      if (mutation.addedNodes.length !== 0){
        moveSection();
        observer.disconnect();
      }
    });
  });
  if (section) {
    observer.observe(aBDropzone, { 
      subtree: false, 
      childList: true,
      attributes: false,
    });
  }
  
  window.setTimeout(function(){
    aBDropzone?.classList.add('loaded')
  }, 300);

  
  /*FOR JUMPING INTO EDIT MODE*/
  
  function removeSection() {
    let section = document.querySelector('.announcement-bar-section');
    if (!section) return;
    
    let innerText = section.querySelector('#announcement-bar-text-inner-id');

    section.insertAdjacentElement('beforebegin', innerText)
    section.remove();
    aBDropzone.classList.remove('wm-custom-announcement-bar')
  }
  
  
  /** 
  * Mutation Observer
  * Remove Section From Announcement Bar 
  * When Jumping into Edit Mode
  **/
  const editModeObserver = new MutationObserver(function(mutations_list) {
    mutations_list.forEach(function(mutation) {
      let classList = document.body.classList;
      if (mutation.attributeName === 'class' 
          && classList.contains('sqs-edit-mode-active')){
        editModeObserver.disconnect();
        removeSection();
      }
    });
  });

  if(window.self !== window.top) {
    editModeObserver.observe(document.body, { 
      subtree: false, 
      childList: false,
      attributes: true,
    });
  }
}());
