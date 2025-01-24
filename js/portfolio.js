// portfolio.js

// (1) Fetch the JSON data
fetch('js/portfolioData.json')
  .then(response => response.json())
  .then(data => {
    // (2) Call the function to generate the portfolio items
    createPortfolioItems(data);
    // (3) Call the function to generate the modals
    createModals(data);
  })
  .catch(error => {
    console.error('Error fetching portfolio data:', error);
  });

/**
 * Create the list of portfolio items and inject them into #portfolioList
 * @param {Array} data - The array of portfolio objects from JSON.
 */
function createPortfolioItems(data) {
  const portfolioList = document.getElementById('portfolioList');

  data.forEach(item => {
    // Create the <li> element
    const li = document.createElement('li');
    li.className = 'folio-list__item column';
    li.setAttribute('data-animate-el', '');
    // You can use item.id (the numeric id) here if needed, for example:
    li.dataset.itemId = item.id;  // Storing the numeric id as a data attribute

    // Create the anchor link that opens the modal
    const itemLink = document.createElement('a');
    itemLink.className = 'folio-list__item-link';
    // Use modalId for linking to the modal
    itemLink.href = `#${item.modalId}`;

    // Image wrapper
    const itemPic = document.createElement('div');
    itemPic.className = 'folio-list__item-pic';
    const img = document.createElement('img');
    img.src = item.thumbnailImage;
    // Adjust or remove srcset as needed
    img.srcset = `${item.thumbnailImage} 1x, ${item.thumbnailImage} 2x`;
    img.alt = item.altText || '';
    itemPic.appendChild(img);

    // Text wrapper
    const itemText = document.createElement('div');
    itemText.className = 'folio-list__item-text';
    
    // Category
    const catDiv = document.createElement('div');
    catDiv.className = 'folio-list__item-cat';
    catDiv.textContent = item.category;
    
    // Title
    const titleDiv = document.createElement('div');
    titleDiv.className = 'folio-list__item-title';
    titleDiv.textContent = item.projectTitle;

    // Combine text pieces
    itemText.appendChild(catDiv);
    itemText.appendChild(titleDiv);

    // Combine into main link
    itemLink.appendChild(itemPic);
    itemLink.appendChild(itemText);

    // Create the external project link with the standard SVG
    const projLink = document.createElement('a');
    projLink.className = 'folio-list__proj-link';
    projLink.href = item.projectLink;
    projLink.title = 'project link';
    // Insert the standard SVG 
    projLink.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" 
        xmlns="http://www.w3.org/2000/svg">
        <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 
                 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 
                 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 
                 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 
                 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 
                 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
              fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
      </svg>
    `;

    // Insert everything into the li
    li.appendChild(itemLink);
    li.appendChild(projLink);

    // Finally, append to the UL
    portfolioList.appendChild(li);
  });
}

/**
 * Create the modals for each portfolio item and inject them into #modalContainer
 * @param {Array} data - The array of portfolio objects from JSON.
 */
function createModals(data) {
  const modalContainer = document.getElementById('modalContainer');

  data.forEach(item => {
    // Outer wrapper for the modal content
    const modalDiv = document.createElement('div');
    // Use modalId as the ID for the popup
    modalDiv.id = item.modalId;
    // For the library to pick it up as hidden by default:
    modalDiv.hidden = true; 
    
    // Modal inner
    const modalPopup = document.createElement('div');
    modalPopup.className = 'modal-popup';

    // Modal image
    const modalImg = document.createElement('img');
    modalImg.src = item.modalImage;
    modalImg.alt = item.altText || '';

    // Description wrapper
    const descDiv = document.createElement('div');
    descDiv.className = 'modal-popup__desc';

    // Title
    const h5 = document.createElement('h5');
    h5.textContent = item.modalTitle;

    // Paragraph
    const p = document.createElement('p');
    p.textContent = item.modalDescription;

    // Categories (ul & li)
    const ul = document.createElement('ul');
    ul.className = 'modal-popup__cat';

    item.modalCategories.forEach(cat => {
      const li = document.createElement('li');
      li.textContent = cat;
      ul.appendChild(li);
    });

    // Add the link to the project
    const projectLink = document.createElement('a');
    projectLink.href = item.projectLink;
    projectLink.className = 'modal-popup__details';
    projectLink.textContent = item.projectTitle;

    // Put together descDiv
    descDiv.appendChild(h5);
    descDiv.appendChild(p);
    descDiv.appendChild(ul);

    // Combine into modalPopup
    modalPopup.appendChild(modalImg);
    modalPopup.appendChild(descDiv);
    modalPopup.appendChild(projectLink);

    // Put modalPopup into outer container
    modalDiv.appendChild(modalPopup);

    // Append to #modalContainer in the DOM
    modalContainer.appendChild(modalDiv);
  });
}
