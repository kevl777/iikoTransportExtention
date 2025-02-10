document.addEventListener("DOMContentLoaded", () => {
  // Скрываем все кнопки и div'ы, кроме кнопки "Получить данные организации"
  const elementsToHide = [
    "getTerminals",
    "getPaymentTypes",
    "getOrderTypes",
    "getMenu",
    "getExternalMenuV2",
    "getNomenclatureV2",
    "terminalList",
    "paymentList",
    "orderTypeList",
    "menuList",
    "externalMenuV2List",
    "nomenclatureList",
  ];
  elementsToHide.forEach((elementId) => {
    document.getElementById(elementId).style.display = "none";
  });
});

document.getElementById("apiKey").focus();

// Получение токена и данных организаций
document.getElementById("getOrgId").addEventListener("click", async () => {
  const apiKey = document.getElementById("apiKey").value;
  if (!apiKey) {
    alert("Введите API Key");
    return;
  }
  try {
    // Получение токена
    const tokenResponse = await fetch(
      "https://api-ru.iiko.services/api/1/access_token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiLogin: apiKey }),
      }
    );
    if (!tokenResponse.ok) {
      console.error(
        "Ошибка получения токена:",
        tokenResponse.status,
        tokenResponse.statusText
      );
      throw new Error("Ошибка при получении токена");
    }
    const tokenData = await tokenResponse.json();
    const token = tokenData.token;
    document.getElementById("token").value = token;

    // Получение списка организаций
    const orgResponse = await fetch(
      "https://api-ru.iiko.services/api/1/organizations",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!orgResponse.ok) {
      console.error(
        "Ошибка получения данных организаций:",
        orgResponse.status,
        orgResponse.statusText
      );
      throw new Error("Ошибка при получении данных организаций");
    }

    const orgData = await orgResponse.json();
    const orgList = document.getElementById("organizationList");
    orgList.innerHTML = "";

    orgData.organizations.forEach((org) => {
      const listItem = document.createElement("div");
      listItem.className = "org-item";
      const radioId = `org-${org.id}`;
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "organization";
      radio.value = org.id;
      radio.id = radioId;
      const label = document.createElement("label");
      label.htmlFor = radioId;
      const nameDiv = document.createElement("strong");
      nameDiv.textContent = org.name;
      const idDiv = document.createElement("div");
      idDiv.textContent = `ID: ${org.id}`;
      const textContainer = document.createElement("div");
      textContainer.appendChild(nameDiv);
      textContainer.appendChild(idDiv);
      label.appendChild(radio);
      label.appendChild(textContainer);
      listItem.appendChild(label);
      orgList.appendChild(listItem);
    });

    // Показываем остальные элементы
    const elementsToShow = [
      "getTerminals",
      "getPaymentTypes",
      "getOrderTypes",
      "getMenu",
      "getExternalMenuV2",
      "getNomenclatureV2",
      "terminalList",
      "paymentList",
      "orderTypeList",
      "menuList",
      "externalMenuV2List",
      "nomenclatureList",
    ];
    elementsToShow.forEach((elementId) => {
      document.getElementById(elementId).style.display = "block";
    });
  } catch (error) {
    console.error("Ошибка запроса:", error);
    alert("Ошибка: " + error.message);
  }
});

// Функция для получения списка терминалов
document.getElementById("getTerminals").addEventListener("click", async () => {
  const selectedOrgId = document.querySelector(
    'input[name="organization"]:checked'
  );
  const token = document.getElementById("token").value;
  if (!selectedOrgId) {
    alert("Выберите организацию");
    return;
  }
  try {
    const terminalResponse = await fetch(
      "https://api-ru.iiko.services/api/1/terminal_groups",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ organizationIds: [selectedOrgId.value] }),
      }
    );

    if (!terminalResponse.ok) {
      console.error(
        "Ошибка получения терминалов:",
        terminalResponse.status,
        terminalResponse.statusText
      );
      throw new Error("Ошибка при получении терминалов");
    }

    const terminalData = await terminalResponse.json();
    const terminalList = document.getElementById("terminalList");
    terminalList.innerHTML = JSON.stringify(terminalData, null, 2);
  } catch (error) {
    console.error("Ошибка запроса:", error);
    alert("Ошибка: " + error.message);
  }
});

// Функция для получения типов оплат
document
  .getElementById("getPaymentTypes")
  .addEventListener("click", async () => {
    const selectedOrgId = document.querySelector(
      'input[name="organization"]:checked'
    );
    const token = document.getElementById("token").value;
    if (!selectedOrgId) {
      alert("Выберите организацию");
      return;
    }
    try {
      const paymentResponse = await fetch(
        "https://api-ru.iiko.services/api/1/payment_types",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ organizationIds: [selectedOrgId.value] }),
        }
      );

      if (!paymentResponse.ok) {
        console.error(
          "Ошибка получения типов оплат:",
          paymentResponse.status,
          paymentResponse.statusText
        );
        throw new Error("Ошибка при получении типов оплат");
      }

      const paymentData = await paymentResponse.json();
      const paymentList = document.getElementById("paymentList");
      paymentList.innerHTML = JSON.stringify(paymentData, null, 2);
    } catch (error) {
      console.error("Ошибка запроса:", error);
      alert("Ошибка: " + error.message);
    }
  });

// Функция для получения типов заказов
document.getElementById("getOrderTypes").addEventListener("click", async () => {
  const selectedOrgId = document.querySelector(
    'input[name="organization"]:checked'
  );
  const token = document.getElementById("token").value;
  if (!selectedOrgId) {
    alert("Выберите организацию");
    return;
  }
  try {
    const response = await fetch(
      "https://api-ru.iiko.services/api/1/deliveries/order_types",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ organizationIds: [selectedOrgId.value] }),
      }
    );

    if (!response.ok) {
      throw new Error("Ошибка при получении типов заказов");
    }

    const data = await response.json();
    document.getElementById("orderTypeList").innerHTML = JSON.stringify(
      data,
      null,
      2
    );
  } catch (error) {
    alert("Ошибка: " + error.message);
  }
});

// Функция для получения меню
document.getElementById("getMenu").addEventListener("click", async () => {
  const selectedOrgId = document.querySelector(
    'input[name="organization"]:checked'
  );
  const token = document.getElementById("token").value;
  if (!selectedOrgId) {
    alert("Выберите организацию");
    return;
  }
  try {
    const response = await fetch(
      "https://api-ru.iiko.services/api/1/nomenclature",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ organizationId: selectedOrgId.value }),
      }
    );

    if (!response.ok) {
      throw new Error("Ошибка при получении меню");
    }

    const data = await response.json();
    document.getElementById("menuList").innerHTML = JSON.stringify(
      data,
      null,
      2
    );
  } catch (error) {
    alert("Ошибка: " + error.message);
  }
});

// Функция для получения внешнего меню v2
document
  .getElementById("getExternalMenuV2")
  .addEventListener("click", async () => {
    const selectedOrgId = document.querySelector(
      'input[name="organization"]:checked'
    );
    const token = document.getElementById("token").value;
    if (!selectedOrgId) {
      alert("Выберите организацию");
      return;
    }
    try {
      const response = await fetch("https://api-ru.iiko.services/api/2/menu", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          externalMenuId: "",
          organizationIds: [selectedOrgId.value],
          priceCategoryId: "",
          version: 2,
          language: "ru",
          asyncMode: false,
          startRevision: 0,
        }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при получении внешнего меню v2");
      }

      const data = await response.json();
      const menuList = document.getElementById("externalMenuV2List");
      menuList.innerHTML = ""; // Очистка предыдущего списка

      if (Array.isArray(data.externalMenus)) {
        data.externalMenus.forEach((menu) => {
          const listItem = document.createElement("label");
          listItem.className = "menu-item";
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.name = "menuItem";
          checkbox.value = menu.id;
          const labelText = document.createElement("span");
          labelText.textContent = `${menu.id} - ${menu.name}`;
          listItem.appendChild(checkbox);
          listItem.appendChild(labelText);
          menuList.appendChild(listItem);
        });
      } else {
        console.error(
          "Ошибка: externalMenus не является массивом или не существует."
        );
      }
    } catch (error) {
      alert("Ошибка: " + error.message);
    }
  });

// Код для получения номенклатуры v2 (by id)
document
  .getElementById("getNomenclatureV2")
  .addEventListener("click", async () => {
    const selectedOrgId = document.querySelector(
      'input[name="organization"]:checked'
    );
    const selectedMenuId = document.querySelector(
      'input[name="menuItem"]:checked'
    );
    const token = document.getElementById("token").value;
    if (!selectedOrgId) {
      alert("Выберите организацию");
      return;
    }
    if (!selectedMenuId) {
      alert("Выберите меню");
      return;
    }
    try {
      const response = await fetch(
        "https://api-ru.iiko.services/api/2/menu/by_id",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            externalMenuId: selectedMenuId.value,
            organizationIds: [selectedOrgId.value],
            version: 2,
            language: "ru",
            asyncMode: false,
            startRevision: 0,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при получении номенклатуры v2");
      }

      const data = await response.json();
      document.getElementById("nomenclatureList").innerHTML = JSON.stringify(
        data,
        null,
        2
      );
    } catch (error) {
      alert("Ошибка: " + error.message);
    }
  });

// Скачивание результатов в txt файл
document.getElementById("downloadResults").addEventListener("click", () => {
  // Собираем значения полей
  const apiKey = document.getElementById("apiKey").value;
  const token = document.getElementById("token").value;
  const organizationId = document.querySelector(
    'input[name="organization"]:checked'
  )?.value;
  const terminalList = document.getElementById("terminalList").innerText;
  const paymentList = document.getElementById("paymentList").innerText;
  const orderTypeList = document.getElementById("orderTypeList").innerText;
  const menuList = document.getElementById("menuList").innerText;
  const externalMenuV2List =
    document.getElementById("externalMenuV2List").innerText;
  const nomenclatureList =
    document.getElementById("nomenclatureList").innerText;

  // Формируем содержимое файла с заголовками и разделительными линиями
  const fileContent = `
  === API Key ===
  ${apiKey}
  === Token ===
  ${token}
  === Organization ID ===
  ${organizationId}
  === Терминалы ===
  ${terminalList}
  === Типы оплат ===
  ${paymentList}
  === Типы заказов ===
  ${orderTypeList}
  === Меню ===
  ${menuList}
  === Внешнее меню v2 ===
  ${externalMenuV2List}
  === Номенклатура v2 ===
  ${nomenclatureList}
  `;

  // Создаем blob из содержимого файла
  const blob = new Blob([fileContent.trim()], { type: "text/plain" });

  // Создаем ссылку для скачивания файла
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = "results.txt";

  // Автоматически кликаем по ссылке для скачивания файла
  downloadLink.click();
});