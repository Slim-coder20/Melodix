import { getPool } from '../DB/postgres.js'; 
/**
 * GET /api/products
 * Liste tous les produits avec leur stock disponible.
 * Utilise la vue products_with_stock qui joint products, categories et stock_product.
 *
 * Query params optionnels:
 *   - category: slug de la catégorie (ex: guitares-electriques)
 *   - search: recherche dans brand, model, description
 */
export const getProducts = async (req, res) => {
  try {
    const pool = getPool();
    const { category, search } = req.query;

    // Requête de base : on interroge la VUE products_with_stock
    let query = `
      SELECT 
        id, brand, model, slug, id_category, price, monthly, badge, image,
        description, specifications, category_name, category_slug,
        total_stock, total_reserved, available_stock
      FROM products_with_stock
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    // Filtre par catégorie (slug)
    if (category && category.trim()) {
      query += ` AND category_slug = $${paramIndex}`;
      params.push(category.trim());
      paramIndex++;
    }

    // Filtre par recherche (brand, model)
    if (search && search.trim()) {
      query += ` AND (
        LOWER(brand) LIKE $${paramIndex}
        OR LOWER(model) LIKE $${paramIndex}
        OR LOWER(COALESCE(description, '')) LIKE $${paramIndex}
      )`;
      params.push(`%${search.trim().toLowerCase()}%`);
    }

    query += ` ORDER BY brand, model`;

    const result = await pool.query(query, params);

    // Mapper les résultats vers un format compatible avec le frontend
    const products = result.rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      brand: row.brand,
      model: row.model,
      category: row.category_slug,
      categoryName: row.category_name,
      price: parseFloat(row.price),
      monthly: row.monthly ? parseFloat(row.monthly) : null,
      image: row.image,
      badge: row.badge,
      description: row.description,
      specifications: row.specifications,
      availableStock: parseInt(row.available_stock, 10),
    }));

    return res.status(200).json({ products });
  } catch (error) {
    console.error('Erreur getProducts:', error);
    return res.status(500).json({
      message: 'Erreur lors de la récupération des produits',
      error: error.message,
    });
  }
};

/**
 * GET /api/products/:slug
 * Récupère un produit par son slug (ex: fender-st80-sunburst)
 */
export const getProductBySlug = async (req, res) => {
  try {
    const pool = getPool();
    const { slug } = req.params;

    const result = await pool.query(
      `SELECT 
        id, brand, model, slug, id_category, price, monthly, badge, image,
        description, specifications, category_name, category_slug,
        total_stock, total_reserved, available_stock
       FROM products_with_stock
       WHERE slug = $1`,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    const row = result.rows[0];
    const product = {
      id: row.id,
      slug: row.slug,
      brand: row.brand,
      model: row.model,
      category: row.category_slug,
      categoryName: row.category_name,
      price: parseFloat(row.price),
      monthly: row.monthly ? parseFloat(row.monthly) : null,
      image: row.image,
      badge: row.badge,
      description: row.description,
      specifications: row.specifications,
      availableStock: parseInt(row.available_stock, 10),
    };

    return res.status(200).json({ product });
  } catch (error) {
    console.error('Erreur getProductBySlug:', error);
    return res.status(500).json({
      message: 'Erreur lors de la récupération du produit',
      error: error.message,
    });
  }
};
