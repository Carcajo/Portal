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

  let currentPage = 1;
  const itemsPerPage = 5;
  let requestsData = [];


  function generateID() {
    const timestamp = new Date().getTime();
    const id = 'STL' + timestamp;
    return id;
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
      <td>${request.activity}</td>
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
    requestsData.sort((a, b) => new Date(b.activity) - new Date(a.activity));
    displayRequests(currentPage);
  });


  createRequestButton.addEventListener('click', function() {
    const newRequest = {
      id: generateID(),
      status: prompt('Введите статус запроса'),
      description: prompt('Введите описание запроса'),
      activity: new Date().toISOString().slice(0, 10),
      };
    requestsData.push(newRequest);
    displayRequests(currentPage);
  });


  function displayModal(request) {
    modal.style.display = 'block';
    modalRequestId.textContent = request.id;
    modalRequestStatus.textContent = request.status;
    modalRequestDescription.textContent = request.description;
    modalRequestActivity.textContent = request.activity;
    modalRequestSQL.textContent = '';
  }
    function displayRunModal(request) {
  runModal.style.display = 'block';
  runModalRequestId.textContent = request.id;
  runModalDescription.textContent = request.description;
  const downloadCSVButton = document.getElementById('downloadCSV');
  downloadCSVButton.addEventListener('click', downloadCSV);
}

closeModals.forEach(closeModal => {
closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
    runModal.style.display = 'none';
  });

})

  window.addEventListener('click', function(event) {
  console.log(event.target)
    if (event.target === modal) {
      modal.style.display = 'none';
    }
    if (event.target === runModal) {
      runModal.style.display = 'none';
    }
  });


  displayRequests(currentPage);
});
