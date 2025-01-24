// portfolio.js

fetch('js/portfolioData.json') // Adjust if your JSON file is at a different URL/path
  .then(response => response.json())
  .then(data => {
    // data.records is the array we need.
    const records = data.records;
    createPortfolioItems(records);
    createModals(records);
  })
  .catch(error => {
    console.error('Error fetching portfolio data:', error);
  });

/**
 * Generate portfolio list items and inject into #portfolioList
 * @param {Array} records - The array of record objects from your JSON.
 */
function createPortfolioItems(records) {
  const portfolioList = document.getElementById('portfolioList');

  records.forEach(record => {
    // The numeric ID
    const numericId = record.id;
    // All the fields in a shortcut variable
    const fields = record.fields;

    // Create <li> for each portfolio item
    const li = document.createElement('li');
    li.className = 'folio-list__item column';
    li.setAttribute('data-animate-el', '');
    // Main link (opens the modal)
    const itemLink = document.createElement('a');
    itemLink.className = 'folio-list__item-link';
    itemLink.href = `#${fields.modalId}`; // e.g. "#modal-01"

    // Image container
    const itemPic = document.createElement('div');
    itemPic.className = 'folio-list__item-pic';
    const img = document.createElement('img');
    img.src = fields.thumbnailImage;
    // If you need srcset, you can update accordingly
    img.srcset = `${fields.thumbnailImage} 1x, ${fields.thumbnailImage} 2x`,+ 'alt';
    itemPic.appendChild(img);

    // Text container
    const itemText = document.createElement('div');
    itemText.className = 'folio-list__item-text';

    // Category
    const catDiv = document.createElement('div');
    catDiv.className = 'folio-list__item-cat';
    catDiv.textContent = fields.category;

    // Title
    const titleDiv = document.createElement('div');
    titleDiv.className = 'folio-list__item-title';
    titleDiv.textContent = fields.projectTitle;

    // Put category & title into the text container
    itemText.appendChild(catDiv);
    itemText.appendChild(titleDiv);

    // Append image + text into the main link
    itemLink.appendChild(itemPic);
    itemLink.appendChild(itemText);

    // External project link with arrow SVG
    const projLink = document.createElement('a');
    projLink.className = 'folio-list__proj-link';
    projLink.href = fields.projectLink;
    projLink.title = 'project link';
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

    // Put it all in the <li>
    li.appendChild(itemLink);
    li.appendChild(projLink);

    // Finally, append to the UL
    portfolioList.appendChild(li);
  });
}

/**
 * Create the modals and inject into #modalContainer
 * @param {Array} records - The array of record objects from your JSON.
 */
function createModals(records) {
  const modalContainer = document.getElementById('modalContainer');

  records.forEach(record => {
    const fields = record.fields;

    // Remove "L" from modalCategories
    // If "modalCategories" is undefined, handle gracefully:
    let cleanedCategories = [];
    if (Array.isArray(fields.modalCategories)) {
      cleanedCategories = fields.modalCategories.filter(cat => cat !== 'L');
    }

    // Modal wrapper
    const modalDiv = document.createElement('div');
    modalDiv.id = fields.modalId; // e.g. "modal-01"
    modalDiv.hidden = true;

    // Inner modal content
    const modalPopup = document.createElement('div');
    modalPopup.className = 'modal-popup';

    // Modal image
    const modalImg = document.createElement('img');
    modalImg.src = fields.modalImage;
    modalImg.alt = fields.altText || '';

    // Description wrapper
    const descDiv = document.createElement('div');
    descDiv.className = 'modal-popup__desc';

    // Title
    const h5 = document.createElement('h5');
    h5.textContent = fields.modalTitle;

    // Paragraph for the description
    const p = document.createElement('p');
    p.textContent = fields.modalDescription;

    // Categories (ul/li)
    const ul = document.createElement('ul');
    ul.className = 'modal-popup__cat';
    cleanedCategories.forEach(cat => {
      const li = document.createElement('li');
      li.textContent = cat;
      ul.appendChild(li);
    });

    // Project link in the modal (text = modalTitle)
    const projectLink = document.createElement('a');
    projectLink.href = fields.projectLink;
    projectLink.className = 'modal-popup__details';
    projectLink.textContent = fields.modalTitle;

    // Combine description
    descDiv.appendChild(h5);
    descDiv.appendChild(p);
    descDiv.appendChild(ul);

    // Put all inside .modal-popup
    modalPopup.appendChild(modalImg);
    modalPopup.appendChild(descDiv);
    modalPopup.appendChild(projectLink);

    // Put .modal-popup into outer <div>
    modalDiv.appendChild(modalPopup);

    // Append to #modalContainer
    modalContainer.appendChild(modalDiv);
  });
}
