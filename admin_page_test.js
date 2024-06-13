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

  const reviewModal = document.getElementById('reviewModal');
  const reviewRequestId = document.getElementById('reviewRequestId');
  const reviewRequestStatus = document.getElementById('reviewRequestStatus');
  const reviewRequestDate = document.getElementById('reviewRequestDate');
  const reviewRequestName = document.getElementById('reviewRequestName');
  const reviewRequestQuery = document.getElementById('reviewRequestQuery');
  const reviewRequestComment = document.getElementById('reviewRequestComment');

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
        <td><button class="review">Обзор</button></td>
      `;
      tableBody.appendChild(row);

      row.querySelector('.info').addEventListener('click', function() {
        displayModal(request);
      });

      row.querySelector('.launch').addEventListener('click', function() {
        displayRunModal(request);
      });

      row.querySelector('.review').addEventListener('click', function() {
        displayReviewModal(request);
      });
    });
  }

  function updateTable() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayData = requestsData.slice(startIndex, endIndex);

    tableBody.innerHTML = '';
    displayData.forEach(request => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${request.id}</td>
        <td class="status">${request.status}</td>
        <td>${request.description}</td>
        <td>${request.activity}</td>
        <td><button class="info">Инфо</button></td>
        <td><button class="launch">Запуск</button></td>
        <td><button class="review">Обзор</button></td>
      `;
      tableBody.appendChild(row);

      row.querySelector('.info').addEventListener('click', function() {
        displayModal(request);
      });

      row.querySelector('.launch').addEventListener('click', function() {
        displayRunModal(request);
      });

      row.querySelector('.review').addEventListener('click', function() {
        displayReviewModal(request);
      });
    });
  }

  function displayReviewModal(request) {
    reviewModal.style.display = 'block';
    reviewRequestId.textContent = request.id;
    reviewRequestStatus.textContent = request.status;
    reviewRequestDate.textContent = request.activity;
    reviewRequestName.textContent = 'Пухов Максим Юрьевич';
    reviewRequestQuery.textContent = request.description;
    reviewRequestComment.textContent = 'Работает - не трогай!!!';

    const approveButton = reviewModal.querySelector('.approve');
    const rejectButton = reviewModal.querySelector('.reject');

    approveButton.addEventListener('click', function() {
      request.status = 'approved';
      reviewRequestStatus.textContent = 'approved';
      closeReviewModal();
      updateTable();
    });

    rejectButton.addEventListener('click', function() {
      request.status = 'rejected';
      reviewRequestStatus.textContent = 'rejected';
      closeReviewModal();
      updateTable();
    });
  }

  function closeReviewModal() {
    reviewModal.style.display = 'none';
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
    }
    displayRequests(currentPage);
  });

  idHeader.addEventListener('click', function() {
    requestsData.sort((a, b) => a.id.localeCompare(b.id));
    updateTable();
  });

  statusHeader.addEventListener('click', function() {
    requestsData.sort((a, b) => a.status.localeCompare(b.status));
    updateTable();
  });

  descriptionHeader.addEventListener('click', function() {
    requestsData.sort((a, b) => a.description.localeCompare(b.description));
    updateTable();
  });

  activityHeader.addEventListener('click', function() {
    requestsData.sort((a, b) => new Date(b.activity) - new Date(a.activity));
    updateTable();
  });

  createRequestButton.addEventListener('click', async function() {
  const newRequest = {
    id: generateID(),
    status: prompt('Введите статус запроса'),
    description: prompt('Введите описание запроса'),
    activity: new Date().toISOString().slice(0, 10),
  };

  const response = await fetch('/requests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newRequest),
  });

  if (response.ok) {
    const createdRequest = await response.json();
    requestsData.push(createdRequest);
    updateTable();
  } else {
    alert('Ошибка при создании запроса');
  }
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
      reviewModal.style.display = 'none';
    });
  });

  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
    if (event.target === runModal) {
      runModal.style.display = 'none';
    }
    if (event.target === reviewModal) {
      reviewModal.style.display = 'none';
    }
  });

  requestsData = [
    {
      id: generateID(),
      status: 'in review',
      description: 'Запрос остатков по пакетам',
      activity: '2024-04-04'
    },
    {
      id: generateID(),
      status: 'approved',
      description: 'Запрос данных о продажах',
      activity: '2024-04-05'
    }
  ];

  displayRequests(currentPage);
});
