function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([.$?*|{}()[]\/+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

document.addEventListener('DOMContentLoaded', function() {
  const username = getCookie('username');

  const userFields = document.querySelectorAll('.user-field');
  userFields.forEach(field => {
    field.textContent = username;
  });

document.addEventListener('DOMContentLoaded', function() {
  const idHeader = document.getElementById('idHeader');
  const statusHeader = document.getElementById('statusHeader');
  const descriptionHeader = document.getElementById('descriptionHeader');
  const activityHeader = document.getElementById('activityHeader');
  const nextPageButton = document.getElementById('nextPage');
  const prevPageButton = document.getElementById('prevPage');
  const createRequestButton = document.getElementById('createRequest');
  const tableBody = document.querySelector('tbody');
  const modal = document.getElementById('modal');
  const closeModals = document.querySelectorAll('.close');
  const modalRequestId = document.getElementById('modalRequestId');
  const modalRequestStatus = document.getElementById('modalRequestStatus');
  const modalRequestDescription = document.getElementById('modalRequestDescription');
  const modalRequestActivity = document.getElementById('modalRequestActivity');
  const modalRequestSQL = document.getElementById('modalRequestSQL');
  const runModal = document.getElementById('runModal');
  const runModalRequestId = document.getElementById('runModalRequestId');
  const runModalDescription = document.getElementById('runModalDescription');
  const runModalResults = document.getElementById('runModalResults');
  const createRequestModal = document.getElementById('createRequestModal');

  let currentPage = 1;
  const itemsPerPage = 5;
  let requestsData = [];

  function generateID() {
    const timestamp = new Date().getTime();
    const id = 'STL' + timestamp;
    return id;
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const formattedDate = `${date.toLocaleDateString('en-GB')} (${hours}:${minutes}:${seconds})`;
    return formattedDate;
  }

  function displayRequests(pageNumber) {
    tableBody.innerHTML = '';

    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayData = requestsData.slice(startIndex, endIndex);

    displayData.forEach(request => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${request.id}</td>
        <td class="status">${request.status}</td>
        <td>${request.description}</td>
        <td>${request.comment}</td>
        <td>${request.request}</td>
        <td>${request.activity ? formatDate(request.activity) : ''}</td>
        <td><button class="info">Инфо</button></td>
        <td><button class="launch">Запуск</button></td>
      `;
      tableBody.appendChild(row);

      row.querySelector('.info').addEventListener('click', function() {
        displayModal(request);
      });

      row.querySelector('.launch').addEventListener('click', function() {
        displayRunModal(request);
      });
    });
  }

  function downloadCSV() {
    const csvData = 'ID,Description\n1,"Если читаешь"\n2,"ЗНАЧИТ СКАЧАЛО"';
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'data.csv');
  }

  nextPageButton.addEventListener('click', function() {
    currentPage++;
    displayRequests(currentPage);
  });

  prevPageButton.addEventListener('click', function() {
    if (currentPage > 1) {
      currentPage--;
      displayRequests(currentPage);
    }
  });

  idHeader.addEventListener('click', function() {
    requestsData.sort((a, b) => a.id.localeCompare(b.id));
    displayRequests(currentPage);
  });

  statusHeader.addEventListener('click', function() {
    requestsData.sort((a, b) => a.status.localeCompare(b.status));
    displayRequests(currentPage);
  });

  descriptionHeader.addEventListener('click', function() {
    requestsData.sort((a, b) => a.description.localeCompare(b.description));
    displayRequests(currentPage);
  });

  activityHeader.addEventListener('click', function() {
    requestsData.sort((a, b) => {
      const dateA = new Date(a.activity);
      const dateB = new Date(b.activity);
      return dateB - dateA;
    });
    displayRequests(1);
  });

  createRequestButton.addEventListener('click', function() {
    var currentDate = new Date();
    var formattedDate = currentDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/, '$1.$2.$3 ($4:$5:$6)');

    document.getElementById('id').textContent = generateID();
    document.getElementById('date_created').textContent = formattedDate;
    document.getElementById('last_activity').textContent = formattedDate;
    createRequestModal.style.display = 'block';
  });

  closeModals.forEach(closeModal => {
    closeModal.addEventListener('click', function() {
      modal.style.display = 'none';
      runModal.style.display = 'none';
      createRequestModal.style.display = 'none';
    });
  });

  window.addEventListener('click', function(event) {
    if (event.target === createRequestModal) {
      createRequestModal.style.display = 'none';
    }
    if (event.target === modal) {
      modal.style.display = 'none';
    }
    if (event.target === runModal) {
      runModal.style.display = 'none';
    }
  });

  const createRequestForm = document.getElementById('createRequestForm');
  createRequestForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const newRequest = {
      id: document.getElementById('id').textContent,
      user: currentUser,
      date_created: document.getElementById('date_created').textContent,
      last_activity: document.getElementById('last_activity').textContent,
      status: 'in review',
      review_user: 'Ревьюер',
      description: document.getElementById('description').value,
      comment: document.getElementById('comment').value,
      request: document.getElementById('request').value,
      activity: new Date().toISOString()
    };

    requestsData.push(newRequest);
    createRequestModal.style.display = 'none';
    displayRequests(currentPage);
  });

  function displayModal(request) {
  modal.style.display = 'block';
  modalRequestId.textContent = request.id;
  modalRequestStatus.textContent = request.status;
  modalRequestDescription.textContent = request.description;
  modalRequestComment.textContent = request.comment;
  modalRequestRequest.textContent = request.request;
  modalRequestActivity.textContent = request.activity ? formatDate(request.activity) : '';
  modalRequestUser.textContent = request.user;
  modalRequestDateCreated.textContent = request.date_created;
  modalRequestLastActivity.textContent = request.last_activity;
  modalRequestReviewUser.textContent = request.review_user;
}

  function displayRunModal(request) {
    runModal.style.display = 'block';
    runModalRequestId.textContent = request.id;
    runModalDescription.textContent = request.description;
    const downloadCSVButton = document.getElementById('downloadCSV');
    downloadCSVButton.addEventListener('click', downloadCSV);
  }

  displayRequests(currentPage);
});
