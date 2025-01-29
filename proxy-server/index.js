import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.post("/get-token", async (req, res) => {
  const { apiLogin } = req.body;

  try {
    const response = await fetch(
      "https://api-ru.iiko.services/api/1/access_token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiLogin }),
      }
    );

    if (!response.ok) throw new Error("Ошибка при получении токена");

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/get-organization-id", async (req, res) => {
  const { token } = req.body;

  try {
    const response = await fetch(
      "https://api-ru.iiko.services/api/1/organizations",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error("Ошибка при получении ID организации");

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/get-terminal-groups", async (req, res) => {
  const { token, organizationIds } = req.body;

  try {
    const response = await fetch(
      "https://api-ru.iiko.services/api/1/terminal_groups",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ organizationIds }),
      }
    );

    if (!response.ok) throw new Error("Ошибка при получении терминалов");

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/get-payment-types", async (req, res) => {
  const { token, organizationIds } = req.body;

  try {
    const response = await fetch(
      "https://api-ru.iiko.services/api/1/payment_types",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ organizationIds }),
      }
    );

    if (!response.ok) throw new Error("Ошибка при получении типов оплат");

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Маршрут для получения типов заказов
app.post("/get-order-types", async (req, res) => {
  const { token, organizationIds } = req.body;

  try {
    const response = await fetch(
      "https://api-ru.iiko.services/api/1/deliveries/order_types",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ organizationIds }),
      }
    );

    if (!response.ok) throw new Error("Ошибка при получении типов заказов");

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Маршрут для получения меню
app.post("/get-menu", async (req, res) => {
  const { token, organizationId } = req.body;

  try {
    const response = await fetch(
      "https://api-ru.iiko.services/api/1/nomenclature",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ organizationId }),
      }
    );

    if (!response.ok) throw new Error("Ошибка при получении меню");

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Прокси-сервер запущен на http://localhost:${PORT}`);
});

// Маршрут для получения внешнего меню v2
app.post("/get-external-menu-v2", async (req, res) => {
  const { token, organizationId, externalMenuId, priceCategoryId, language } =
    req.body;

  try {
    const response = await fetch("https://api-ru.iiko.services/api/2/menu", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        externalMenuId,
        organizationIds: [organizationId],
        priceCategoryId,
        version: 2,
        language,
        asyncMode: false,
        startRevision: 0,
      }),
    });

    if (!response.ok) throw new Error("Ошибка при получении внешнего меню v2");

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Маршрут для получения номенклатуры v2 (по ID)
app.post("/get-nomenclature-v2", async (req, res) => {
  const {
    token,
    organizationIds,
    externalMenuId,
    priceCategoryId,
    version,
    language,
    asyncMode,
    startRevision,
  } = req.body;

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
          externalMenuId,
          organizationIds,
          version,
          language,
          asyncMode,
          startRevision,
        }),
      }
    );

    if (!response.ok) throw new Error("Ошибка при получении номенклатуры v2");

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
