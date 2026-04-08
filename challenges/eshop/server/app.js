const express = require('express');
const path = require('path');
const parts = require('../automobileParts.json');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// GET /api/parts - paginated list
app.get('/api/parts', (req, res) => {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const page = parts.slice(offset, offset + limit);
    res.json({ total: parts.length, offset, limit, data: page });
});

// GET /api/parts/:id - part details
app.get('/api/parts/:id', (req, res) => {
    const part = parts.find(p => p.id === parseInt(req.params.id));
    if (!part) return res.status(404).json({ error: 'Part not found' });
    res.json(part);
});

// GET /api/parts/search - search by name, description, manufacturer, price
app.get('/api/search', (req, res) => {
    const { q, minPrice, maxPrice } = req.query;
    let results = [...parts];

    if (q) {
        const query = q.toLowerCase();
        results = results.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.manufacturer.toLowerCase().includes(query)
        );
    }
    if (minPrice) results = results.filter(p => p.price >= parseFloat(minPrice));
    if (maxPrice) results = results.filter(p => p.price <= parseFloat(maxPrice));

    res.json({ total: results.length, data: results });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
