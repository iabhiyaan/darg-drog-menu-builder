const appendToNav = document.querySelector('nav ul')
const menuListItems = appendToNav.children
const menuItemGroup = document.querySelector('.menu_item_group')

let urlTitle = document.querySelector('.url__title')
let urlLink = document.querySelector('.url__link')

// get all menu items starts
function getAllMenuItems() {
   menuItemGroup.innerHTML = ''
   Array.from(menuListItems).map((item, index) => {
      const menuLink = item.children[0].getAttribute('href')
      let menuItem = item.children[0].textContent

      menuItem = setMenuItem(menuLink, menuItem)
      menuItemGroup.insertAdjacentHTML('beforeend', menuItem)
   })
}

getAllMenuItems()
// get all menu items ends

// open modal starts
const openFormEl = document.querySelector('.open__form')
const modalEl = document.querySelector('.add__form')

function openModal(e) {
   modalEl.classList.remove('hidden')
}
openFormEl.addEventListener('click', openModal)
// open modal ends

// close modal starts
function closeModal(e) {
   urlTitle.value = ''
   urlLink.value = ''
   modalEl.classList.add('hidden')
}
const closeFormEl = document.querySelector('.close__form')
closeFormEl.addEventListener('click', closeModal)
// close modal ends

function setMenuItem(link, title) {
   return `
   <li class="menu_item_list" draggable="true" data-href="${link}" data-title="${title}" data-id="${
      Math.floor(Math.random() * 1000) + Date.now()
   }" >
       <span>${title}</span>
       <div style="display:flex">
          <button class="open_edit_form">Edit</button>
          <button class="delete_menu">Delete</button>
       </div>
   </li>`
}

function setItemToNav(link, title, index) {
   return `
    <li class="nav-item ${index == 0 ? 'active' : ''}">
       <a class="nav-link" href="${link}">${title}</a>
    </li>
    `
}

// add menu starts
function addMenuItem(e) {
   if (urlTitle.value == '' && urlLink.value == '') {
      alert('Please enter title and link')
      return
   }
   // const listItem = setItemToNav(urlLink.value, urlTitle.value)
   // appendToNav.insertAdjacentHTML('beforeend', listItem)

   const menuItem = setMenuItem(urlLink.value, urlTitle.value)
   menuItemGroup.insertAdjacentHTML('beforeend', menuItem)

   closeModal()
}
const addUrlEl = document.querySelector('.add__url')
addUrlEl.addEventListener('click', addMenuItem)
// add menu ends

// edit menu item starts
let editUrlTitle = document.querySelector('.edit_url_title')
let editUrlLink = document.querySelector('.edit_url_link')

const listId = document.querySelector('.list_id')
const editForm = document.querySelector('.edit__form')

function openEditModal() {
   editForm.classList.remove('hidden')
}

function editMenuItem(e) {
   const targetEl = e.target

   const menuLink = targetEl.parentNode.parentNode.getAttribute('data-href')
   const menuTitle = targetEl.parentNode.parentNode.getAttribute('data-title')
   listId.value = targetEl.parentNode.parentNode.getAttribute('data-id')

   editUrlTitle.value = menuTitle
   editUrlLink.value = menuLink

   openEditModal()
}

// open edit form:
// menuItemGroup.addEventListener("click", editMenuItem)
addDynamicEventListener(document.body, 'click', '.open_edit_form', editMenuItem)
// edit menu item ends

// update menu starts
function updateMenu(e) {
   if (editUrlTitle.value == '' && editUrlLink.value == '') {
      alert('Please enter title and link')
      return
   }
   const oldLi = document.querySelector(`li[data-id="${listId.value}"]`)

   oldLi.children[0].textContent = editUrlTitle.value
   oldLi.setAttribute('data-title', editUrlTitle.value)
   oldLi.setAttribute('data-href', editUrlLink.value)

   closeEditForm()
}
const updateButton = document.querySelector('.update__url')
updateButton.addEventListener('click', updateMenu)
// update menu ends

// close edit menu starts
function closeEditForm() {
   editUrlTitle.value = ''
   editUrlLink.value = ''
   editForm.classList.add('hidden')
}
const closeButton = document.querySelector('.close__edit__form')
closeButton.addEventListener('click', closeEditForm)
// close edit menu ends

// delete menu starts
function deleteMenu(e) {
   const targetEl = e.target
   targetEl.parentNode.parentNode.remove()
}
// menuItemGroup.addEventListener("click", deleteMenu)
addDynamicEventListener(document.body, 'click', '.delete_menu', deleteMenu)
// delete menu ends

const updateDynamicMenu = document.querySelector('.update_dynamic_menu')
function setNavBar() {
   appendToNav.innerHTML = ''
   Array.from(menuItemGroup.children).forEach((item, index) => {
      const listItem = setItemToNav(
         item.dataset.href,
         item.dataset.title,
         index
      )
      appendToNav.insertAdjacentHTML('beforeend', listItem)
   })
}
updateDynamicMenu.addEventListener('click', setNavBar)

// drag and drop starts

function handleDragStart(e) {
   const targetEl = e.target
   targetEl.classList.add('dragging')

   dragSrcEl = targetEl

   e.dataTransfer.effectAllowed = 'move'
   e.dataTransfer.setData('text/html', targetEl.innerHTML)
}

function handleDragEnter(e) {
   e.target.classList.add('dragover')
}

function handleDragOver(e) {
   if (e.preventDefault) {
      e.preventDefault()
   }

   e.dataTransfer.dropEffect = 'move'
   return false
}

function handleDragLeave(e) {
   e.target.classList.remove('dragover')
}

function handleDrop(e) {
   if (e.stopPropagation) {
      e.stopPropagation()
   }
   const targetEl = e.target
   if (dragSrcEl != targetEl) {
      dragSrcEl.innerHTML = targetEl.innerHTML
      targetEl.innerHTML = e.dataTransfer.getData('text/html')
   }

   const hrefEnd = targetEl.getAttribute('data-href')
   const titleEnd = targetEl.getAttribute('data-title')

   const hrefSource = dragSrcEl.getAttribute('data-href')
   const titleSource = dragSrcEl.getAttribute('data-title')

   targetEl.setAttribute('data-href', hrefSource)
   targetEl.setAttribute('data-title', titleSource)

   dragSrcEl.setAttribute('data-href', hrefEnd)
   dragSrcEl.setAttribute('data-title', titleEnd)

   return false
}

function handleDragEnd(e) {
   Array.from(cols).forEach((col) => {
      col.classList.remove('dragover')
      col.classList.remove('dragging')
   })
   e.target.classList.remove('dragging')
   e.target.classList.remove('dragover')
}

var cols = document.querySelectorAll('#columns li')
addDynamicEventListener(
   document.body,
   'dragstart',
   '#columns li',
   handleDragStart
)
addDynamicEventListener(
   document.body,
   'dragenter',
   '#columns li',
   handleDragEnter
)
addDynamicEventListener(
   document.body,
   'dragover',
   '#columns li',
   handleDragOver
)
addDynamicEventListener(
   document.body,
   'dragleave',
   '#columns li',
   handleDragLeave
)
addDynamicEventListener(document.body, 'drop', '#columns li', handleDrop)
addDynamicEventListener(document.body, 'dragend', '#columns li', handleDragEnd)
// ;[].forEach.call(cols, function (col) {
//    col.addEventListener('dragstart', handleDragStart, false)
//    col.addEventListener('dragenter', handleDragEnter, false)
//    col.addEventListener('dragover', handleDragOver, false)
//    col.addEventListener('dragleave', handleDragLeave, false)
//    col.addEventListener('drop', handleDrop, false)
//    col.addEventListener('dragend', handleDragEnd, false)
// })

var dragSrcEl = null

// drag and drop ends
