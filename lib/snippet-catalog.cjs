const scenarios = {
  pl: "Pobierz aktywne produkty z wybranej kategorii, posortuj je i zwróć maksymalnie 50 wyników.",
  en: "Fetch active products for a selected category, sort them, and return at most 50 results.",
  es: "Obtén productos activos de una categoría, ordénalos y devuelve como máximo 50 resultados.",
  de: "Lade aktive Produkte einer Kategorie, sortiere sie und gib höchstens 50 Ergebnisse zurück.",
  fr: "Récupérez les produits actifs d’une catégorie, triez-les et renvoyez au plus 50 résultats.",
};

const categoryScenarios = {
  pl: {
    frontend: "Załaduj aktywne produkty wybranej kategorii w modelu danych danego frameworka i zwróć typowaną listę.",
    backend: "Obsłuż filtrowane żądanie HTTP dla aktywnych produktów z walidacją kategorii i ograniczeniem wyników.",
    databases: "Wykonaj parametryzowane zapytanie o aktywne produkty kategorii, posortowane po nazwie i ograniczone do 50 rekordów.",
    "ai-models": "Zbuduj odpowiedź o katalogu produktów opartą na danych: wyszukiwarka wektorowa pobiera dopasowania, a model syntetyzuje wyłącznie ich treść.",
    devops: "Skonfiguruj trwały, prywatny magazyn obiektów dla obrazów katalogu produktów.",
    css: "Wyrenderuj dostępną klawiaturą kartę produktu z nazwą i ceną w wybranym systemie UI.",
    general: "Pobierz aktywne produkty wybranej kategorii i zwróć typowaną, ograniczoną listę.",
  },
  en: {
    frontend: "Load active products for a selected category using the framework's data-loading model and return a typed list.",
    backend: "Handle a filtered HTTP request for active products with category validation and a bounded result set.",
    databases: "Run a parameterized query for active products in one category, sorted by name and limited to 50 rows.",
    "ai-models": "Build an evidence-grounded product-catalogue answer: retrieve matching records and synthesize only facts in the supplied context.",
    devops: "Configure private, durable object storage for product catalogue images.",
    css: "Render an accessible product card with its name and price using the selected UI system.",
    general: "Fetch active products for one category and return a typed, bounded result set.",
  },
  es: {
    frontend: "Carga productos activos de una categoría con el modelo de datos del framework y devuelve una lista tipada.",
    backend: "Gestiona una petición HTTP filtrada de productos activos, valida la categoría y limita los resultados.",
    databases: "Ejecuta una consulta parametrizada de productos activos, ordenada por nombre y limitada a 50 filas.",
    "ai-models": "Genera una respuesta fundamentada sobre el catálogo: recupera registros relevantes y sintetiza solo los hechos del contexto.",
    devops: "Configura almacenamiento de objetos privado y duradero para imágenes del catálogo.",
    css: "Renderiza una tarjeta de producto accesible con nombre y precio usando el sistema UI elegido.",
    general: "Obtén productos activos de una categoría y devuelve un conjunto tipado y limitado.",
  },
  de: {
    frontend: "Lade aktive Produkte einer Kategorie mit dem Datenmodell des Frameworks und gib eine typisierte Liste zurück.",
    backend: "Verarbeite eine gefilterte HTTP-Anfrage für aktive Produkte, validiere die Kategorie und begrenze die Ergebnisse.",
    databases: "Führe eine parametrisierte Abfrage aktiver Produkte aus, sortiert nach Name und auf 50 Zeilen begrenzt.",
    "ai-models": "Erstelle eine beleggestützte Katalogantwort: Rufe passende Datensätze ab und fasse nur Fakten aus dem Kontext zusammen.",
    devops: "Richte privaten, dauerhaften Objektspeicher für Produktkatalogbilder ein.",
    css: "Rendere eine barrierearme Produktkarte mit Name und Preis im gewählten UI-System.",
    general: "Lade aktive Produkte einer Kategorie und gib eine typisierte, begrenzte Ergebnismenge zurück.",
  },
  fr: {
    frontend: "Chargez les produits actifs d’une catégorie avec le modèle de données du framework et renvoyez une liste typée.",
    backend: "Traitez une requête HTTP filtrée de produits actifs, validez la catégorie et limitez les résultats.",
    databases: "Exécutez une requête paramétrée sur les produits actifs, triée par nom et limitée à 50 lignes.",
    "ai-models": "Produisez une réponse étayée sur le catalogue : récupérez les éléments pertinents et synthétisez uniquement les faits du contexte.",
    devops: "Configurez un stockage objet privé et durable pour les images du catalogue.",
    css: "Affichez une carte produit accessible avec son nom et son prix dans le système UI choisi.",
    general: "Récupérez les produits actifs d’une catégorie et renvoyez un résultat typé et limité.",
  },
};

const productType = `type Product = {
  id: string;
  name: string;
  categoryId: string;
  active: boolean;
  priceCents: number;
};`;

function frontendSnippet(tool) {
  if (tool === "nextjs") {
    return `import { notFound } from "next/navigation";
import { productRepository } from "@/lib/products";

type Product = { id: string; name: string; priceCents: number };

export default async function CategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  if (!category) notFound();

  const products: Product[] = await productRepository.listActiveByCategory({
    categoryId: category,
    orderBy: "name",
    limit: 50,
  });
  return <ul>{products.map((product) => <li key={product.id}>{product.name}</li>)}</ul>;
}`;
  }
  if (tool === "remix") {
    return `import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { productRepository } from "~/models/products.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const categoryId = new URL(request.url).searchParams.get("category");
  if (!categoryId) throw new Response("category is required", { status: 400 });
  const products = await productRepository.listActiveByCategory({
    categoryId,
    orderBy: "name",
    limit: 50,
  });
  return json({ products });
}

export default function CategoryRoute() {
  const { products } = useLoaderData<typeof loader>();
  return <ul>{products.map((product) => <li key={product.id}>{product.name}</li>)}</ul>;
}`;
  }
  if (tool === "nuxt") {
    return `type Product = { id: string; name: string; priceCents: number };

export async function useCategoryProducts(categoryId: string) {
  if (!categoryId.trim()) throw new Error("category is required");
  return useAsyncData<Product[]>(
    \`products:\${categoryId}\`,
    () => $fetch("/api/products", {
      query: { category: categoryId, active: true, limit: 50, sort: "name" },
    }),
  );
}`;
  }
  if (tool === "vue") {
    return `import { computed, type Ref } from "vue";

${productType}

export function useCategoryProducts(products: Ref<Product[]>, categoryId: Ref<string>) {
  return computed(() =>
    products.value
      .filter((product) => product.active && product.categoryId === categoryId.value)
      .sort((left, right) => left.name.localeCompare(right.name))
      .slice(0, 50),
  );
}`;
  }
  if (tool === "svelte") {
    return `import type { PageServerLoad } from "./$types";
import { productRepository } from "$lib/server/products";

export const load: PageServerLoad = async ({ url }) => {
  const categoryId = url.searchParams.get("category");
  if (!categoryId) return { products: [], error: "category is required" };

  const products = await productRepository.listActiveByCategory({
    categoryId,
    orderBy: "name",
    limit: 50,
  });
  return { products };
};`;
  }
  if (tool === "angular") {
    return `import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import type { Observable } from "rxjs";

type Product = { id: string; name: string; priceCents: number };

@Injectable({ providedIn: "root" })
export class ProductApi {
  private readonly http = inject(HttpClient);

  listByCategory(categoryId: string): Observable<Product[]> {
    if (!categoryId.trim()) throw new Error("category is required");
    const params = new HttpParams()
      .set("category", categoryId)
      .set("active", "true")
      .set("sort", "name")
      .set("limit", "50");
    return this.http.get<Product[]>("/api/products", { params });
  }
}`;
  }
  if (tool === "solidjs" || tool === "qwik") {
    if (tool === "qwik") {
      return `import { routeLoader$ } from "@builder.io/qwik-city";
import { productRepository } from "~/models/products";

export const useCategoryProducts = routeLoader$(async ({ url, status }) => {
  const categoryId = url.searchParams.get("category");
  if (!categoryId) {
    status(400);
    return { products: [] };
  }
  const products = await productRepository.listActiveByCategory({
    categoryId,
    orderBy: "name",
    limit: 50,
  });
  return { products };
});`;
    }
    return `import { createResource } from "solid-js";

type Product = { id: string; name: string; priceCents: number };

async function loadProducts(categoryId: string): Promise<Product[]> {
  const response = await fetch(
    \`/api/products?category=\${encodeURIComponent(categoryId)}&active=true&limit=50&sort=name\`,
  );
  if (!response.ok) throw new Error(\`Product request failed: \${response.status}\`);
  return (await response.json()) as Product[];
}

export function createCategoryProducts(categoryId: () => string) {
  return createResource(categoryId, loadProducts);
}`;
  }
  if (tool === "astro") {
    return `import type { GetStaticPaths } from "astro";
import { productRepository } from "../lib/products";

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await productRepository.listCategories();
  return Promise.all(
    categories.map(async ({ id }) => ({
      params: { category: id },
      props: {
        products: await productRepository.listActiveByCategory({
          categoryId: id,
          orderBy: "name",
          limit: 50,
        }),
      },
    })),
  );
};`;
  }
  if (tool === "gatsby") {
    return `import type { GetServerData } from "gatsby";
import { productRepository } from "../models/products.server";

type Product = { id: string; name: string; priceCents: number };

export const getServerData: GetServerData = async ({ query }) => {
  const categoryId = typeof query.category === "string" ? query.category : "";
  if (!categoryId) return { status: 400, props: { products: [] as Product[] } };
  const products = await productRepository.listActiveByCategory({
    categoryId,
    orderBy: "name",
    limit: 50,
  });
  return { props: { products } };
};`;
  }
  if (tool === "vite" || tool === "webpack") {
    const endpoint =
      tool === "vite"
        ? "import.meta.env.VITE_PRODUCTS_API"
        : "process.env.PRODUCTS_API_URL";
    return `type Product = { id: string; name: string; priceCents: number };

export async function loadCategoryProducts(categoryId: string): Promise<Product[]> {
  const apiBase = ${endpoint};
  if (!apiBase) throw new Error("PRODUCTS_API_URL must be configured");
  const url = new URL("/products", apiBase);
  url.searchParams.set("category", categoryId);
  url.searchParams.set("active", "true");
  url.searchParams.set("sort", "name");
  url.searchParams.set("limit", "50");

  const response = await fetch(url);
  if (!response.ok) throw new Error(\`Product request failed: \${response.status}\`);
  const payload = (await response.json()) as { products: Product[] };
  return payload.products;
}`;
  }

  if (tool === "react") {
    return `import type { ReactNode } from "react";

${productType}

export function CategoryProducts({ products, categoryId }: {
  products: Product[];
  categoryId: string;
}): ReactNode {
  const visible = products
    .filter((product) => product.active && product.categoryId === categoryId)
    .sort((left, right) => left.name.localeCompare(right.name))
    .slice(0, 50);
  return <ul>{visible.map((product) => <li key={product.id}>{product.name}</li>)}</ul>;
}`;
  }
  return `type Product = { id: string; name: string; priceCents: number };

export async function load${toPascalCase(tool)}CategoryProducts(
  categoryId: string,
): Promise<Product[]> {
  const response = await fetch(
    \`/api/products?category=\${encodeURIComponent(categoryId)}&active=true&limit=50&sort=name\`,
  );
  if (!response.ok) throw new Error(\`Product request failed: \${response.status}\`);
  const payload = (await response.json()) as { products: Product[] };
  return payload.products;
}`;
}

function backendSnippet(tool) {
  if (tool === "express") {
    return `import express, { type NextFunction, type Request, type Response } from "express";
import { productRepository } from "./products";

const app = express();

app.get("/api/products", async (request: Request, response: Response, next: NextFunction) => {
  try {
    const categoryId = request.query.category;
    if (typeof categoryId !== "string" || !categoryId.trim()) {
      return response.status(400).json({ error: "category is required" });
    }
    const products = await productRepository.listActiveByCategory({
      categoryId,
      orderBy: "name",
      limit: 50,
    });
    return response.json({ products });
  } catch (error) {
    return next(error);
  }
});`;
  }
  if (tool === "fastify") {
    return `import Fastify from "fastify";
import { productRepository } from "./products";

const app = Fastify();

app.get<{ Querystring: { category?: string } }>(
  "/api/products",
  async (request, reply) => {
    const categoryId = request.query.category;
    if (!categoryId?.trim()) {
      return reply.code(400).send({ error: "category is required" });
    }
    const products = await productRepository.listActiveByCategory({
      categoryId,
      orderBy: "name",
      limit: 50,
    });
    return { products };
  },
);`;
  }
  if (tool === "hono") {
    return `import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { productRepository } from "./products";

const app = new Hono();
const querySchema = z.object({ category: z.string().trim().min(1) });

app.get("/api/products", zValidator("query", querySchema), async (context) => {
  const { category } = context.req.valid("query");
  const products = await productRepository.listActiveByCategory({
    categoryId: category,
    orderBy: "name",
    limit: 50,
  });
  return context.json({ products });
});`;
  }
  if (tool === "nestjs") {
    return `import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { ProductService } from "./product.service";

@Controller("api/products")
export class ProductsController {
  constructor(private readonly products: ProductService) {}

  @Get()
  async list(@Query("category") category?: string) {
    if (!category?.trim()) throw new BadRequestException("category is required");
    return {
      products: await this.products.listActiveByCategory({
        categoryId: category,
        orderBy: "name",
        limit: 50,
      }),
    };
  }
}`;
  }
  if (tool === "nextjs") {
    return `import { NextRequest, NextResponse } from "next/server";
import { productRepository } from "@/lib/products";

export async function GET(request: NextRequest) {
  const categoryId = request.nextUrl.searchParams.get("category");
  if (!categoryId?.trim()) {
    return NextResponse.json({ error: "category is required" }, { status: 400 });
  }
  const products = await productRepository.listActiveByCategory({
    categoryId,
    orderBy: "name",
    limit: 50,
  });
  return NextResponse.json({ products });
}`;
  }
  if (tool === "bun") {
    return `type Product = { id: string; name: string; priceCents: number };

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const categoryId = url.searchParams.get("category");
    if (!categoryId?.trim()) {
      return Response.json({ error: "category is required" }, { status: 400 });
    }
    const response = await fetch(
      \`\${process.env.PRODUCTS_API_URL}/products?category=\${encodeURIComponent(categoryId)}&active=true&limit=50\`,
    );
    if (!response.ok) return new Response("Upstream request failed", { status: 502 });
    const payload = (await response.json()) as { products: Product[] };
    return Response.json({ products: payload.products });
  },
};`;
  }
  if (tool === "deno") {
    return `type Product = { id: string; name: string; priceCents: number };

Deno.serve(async (request: Request): Promise<Response> => {
  const categoryId = new URL(request.url).searchParams.get("category");
  if (!categoryId?.trim()) {
    return Response.json({ error: "category is required" }, { status: 400 });
  }
  const upstream = new URL("/products", Deno.env.get("PRODUCTS_API_URL")!);
  upstream.searchParams.set("category", categoryId);
  upstream.searchParams.set("active", "true");
  upstream.searchParams.set("limit", "50");
  const response = await fetch(upstream);
  if (!response.ok) return new Response("Upstream request failed", { status: 502 });
  const payload = (await response.json()) as { products: Product[] };
  return Response.json({ products: payload.products });
});`;
  }
  if (tool === "graphql") {
    return `type Product = { id: string; name: string; priceCents: number };
type GraphQLResponse<T> = { data?: T; errors?: Array<{ message: string }> };

export async function listProducts(endpoint: string, categoryId: string): Promise<Product[]> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query: "query Products($category: String!) { products(category: $category, active: true, first: 50, orderBy: NAME_ASC) { id name priceCents } }",
      variables: { category: categoryId },
    }),
  });
  if (!response.ok) throw new Error(\`GraphQL request failed: \${response.status}\`);
  const result = (await response.json()) as GraphQLResponse<{ products: Product[] }>;
  if (result.errors?.length || !result.data) {
    throw new Error(result.errors?.map(({ message }) => message).join("; ") ?? "Missing GraphQL data");
  }
  return result.data.products;
}`;
  }
  if (tool === "node" || tool === "javascript") {
    return `import { createServer } from "node:http";
import { parse } from "node:url";
import { productRepository } from "./products";

createServer(async (request, response) => {
  const categoryId = parse(request.url ?? "", true).query.category;
  if (typeof categoryId !== "string" || !categoryId.trim()) {
    response.writeHead(400, { "content-type": "application/json" });
    response.end(JSON.stringify({ error: "category is required" }));
    return;
  }
  try {
    const products = await productRepository.listActiveByCategory({
      categoryId,
      orderBy: "name",
      limit: 50,
    });
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({ products }));
  } catch {
    response.writeHead(500, { "content-type": "application/json" });
    response.end(JSON.stringify({ error: "Could not load products" }));
  }
}).listen(Number(process.env.PORT ?? 3000));`;
  }

  const apiName = tool === "go-gin" ? "Go Gin" : tool === "actix-web" ? "Actix Web" : tool;
  return `type Product = { id: string; name: string; priceCents: number };

export async function listProductsFrom${toPascalCase(tool)}(
  apiBaseUrl: string,
  categoryId: string,
  signal?: AbortSignal,
): Promise<Product[]> {
  const url = new URL("/api/products", apiBaseUrl);
  url.searchParams.set("category", categoryId);
  url.searchParams.set("active", "true");
  url.searchParams.set("sort", "name");
  url.searchParams.set("limit", "50");
  const response = await fetch(url, {
    headers: { accept: "application/json" },
    signal: signal ?? AbortSignal.timeout(5_000),
  });
  if (!response.ok) throw new Error(\`${apiName} product API returned \${response.status}\`);
  const payload = (await response.json()) as { products: Product[] };
  return payload.products;
}`;
}

function databaseSnippet(tool) {
  if (tool === "prisma") {
    return `import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function listProducts(categoryId: string) {
  return prisma.product.findMany({
    where: { categoryId, active: true },
    select: { id: true, name: true, priceCents: true },
    orderBy: { name: "asc" },
    take: 50,
  });
}`;
  }
  if (tool === "drizzle") {
    return `import { and, asc, eq } from "drizzle-orm";
import { db } from "./db";
import { products } from "./schema";

export async function listProducts(categoryId: string) {
  return db
    .select({ id: products.id, name: products.name, priceCents: products.priceCents })
    .from(products)
    .where(and(eq(products.categoryId, categoryId), eq(products.active, true)))
    .orderBy(asc(products.name))
    .limit(50);
}`;
  }
  if (tool === "typeorm") {
    return `import { AppDataSource } from "./data-source";
import { Product } from "./entities/product";

export async function listProducts(categoryId: string): Promise<Product[]> {
  return AppDataSource.getRepository(Product).find({
    where: { categoryId, active: true },
    select: { id: true, name: true, priceCents: true },
    order: { name: "ASC" },
    take: 50,
  });
}`;
  }
  if (tool === "mongoose" || tool === "mongodb") {
    return `import { ProductModel } from "./models/product";

export async function listProducts(categoryId: string) {
  return ProductModel.find({ categoryId, active: true })
    .select({ name: 1, priceCents: 1 })
    .sort({ name: 1 })
    .limit(50)
    .lean()
    .exec();
}`;
  }
  if (tool === "postgresql") {
    return `import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
type ProductRow = { id: string; name: string; price_cents: number };

export async function listProducts(categoryId: string) {
  const result = await pool.query<ProductRow>(
    "SELECT id, name, price_cents FROM products WHERE category_id = $1 AND active = $2 ORDER BY name LIMIT $3",
    [categoryId, true, 50],
  );
  return result.rows;
}`;
  }
  if (tool === "mysql") {
    return `import mysql from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");
const pool = mysql.createPool(databaseUrl);
type ProductRow = { id: string; name: string; price_cents: number };

export async function listProducts(categoryId: string) {
  const [rows] = await pool.execute<mysql.RowDataPacket[]>(
    "SELECT id, name, price_cents FROM products WHERE category_id = ? AND active = ? ORDER BY name LIMIT ?",
    [categoryId, true, 50],
  );
  return rows as ProductRow[];
}`;
  }
  if (tool === "sqlite") {
    return `import Database from "better-sqlite3";

const database = new Database(process.env.SQLITE_PATH ?? "catalog.db", {
  fileMustExist: true,
});
type ProductRow = { id: string; name: string; price_cents: number };

export function listProducts(categoryId: string): ProductRow[] {
  return database
    .prepare(
      "SELECT id, name, price_cents FROM products WHERE category_id = ? AND active = 1 ORDER BY name LIMIT ?",
    )
    .all(categoryId, 50) as ProductRow[];
}`;
  }
  if (tool === "redis") {
    return `import type { RedisClientType } from "redis";

type Product = { id: string; name: string; categoryId: string; active: boolean; priceCents: number };

export async function listProducts(client: RedisClientType, categoryId: string): Promise<Product[]> {
  const ids = await client.sMembers(\`category:\${categoryId}:active-products\`);
  const values = await client.mGet(ids.slice(0, 50).map((id) => \`product:\${id}\`));
  return values
    .filter((value): value is string => value !== null)
    .map((value) => JSON.parse(value) as Product)
    .sort((left, right) => left.name.localeCompare(right.name));
}`;
  }
  if (tool === "memcached") {
    return `type Product = { id: string; name: string; categoryId: string; active: boolean; priceCents: number };
type MemcachedReader = {
  get(key: string): Promise<string | null>;
};

export async function listProducts(cache: MemcachedReader, productIds: readonly string[], categoryId: string) {
  const values = await Promise.all(
    productIds.slice(0, 50).map((id) => cache.get(\`product:\${id}\`)),
  );
  return values
    .filter((value): value is string => value !== null)
    .map((value) => JSON.parse(value) as Product)
    .filter((product) => product.active && product.categoryId === categoryId)
    .sort((left, right) => left.name.localeCompare(right.name));
}`;
  }
  if (tool === "cassandra" || tool === "scylladb") {
    return `import type { Client } from "cassandra-driver";

type ProductRow = { id: string; name: string; category_id: string; price_cents: number };

export async function listProducts(client: Client, categoryId: string) {
  const result = await client.execute<ProductRow>(
    "SELECT id, name, category_id, price_cents FROM products_by_category WHERE category_id = ? AND active = ? LIMIT 50",
    [categoryId, true],
    { prepare: true },
  );
  return result.rows.sort((left, right) => left.name.localeCompare(right.name));
}`;
  }
  if (tool === "supabase" || tool === "appwrite") {
    if (tool === "appwrite") {
      return `import { Query, TablesDB } from "node-appwrite";

type Product = { $id: string; name: string; priceCents: number; active: boolean };

export async function listProducts(database: TablesDB, databaseId: string, categoryId: string) {
  const result = await database.listRows<Product>({
    databaseId,
    tableId: "products",
    queries: [
      Query.equal("categoryId", categoryId),
      Query.equal("active", true),
      Query.orderAsc("name"),
      Query.limit(50),
    ],
  });
  return result.rows;
}`;
    }
    return `import { createClient } from "@supabase/supabase-js";

type Product = { id: string; name: string; price_cents: number };
const databaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!databaseUrl || !serviceKey) throw new Error("Supabase server credentials are required");
const database = createClient(databaseUrl, serviceKey);

export async function listProducts(categoryId: string): Promise<Product[]> {
  const { data, error } = await database
    .from("products")
    .select("id, name, price_cents")
    .eq("category_id", categoryId)
    .eq("active", true)
    .order("name")
    .limit(50);
  if (error) throw new Error(\`Product query failed: \${error.message}\`);
  return data ?? [];
}`;
  }
  if (tool === "firebase") {
    return `import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { db } from "./firebase";

type Product = { id: string; name: string; categoryId: string; active: boolean; priceCents: number };

export async function listProducts(categoryId: string): Promise<Product[]> {
  const productQuery = query(
    collection(db, "products"),
    where("categoryId", "==", categoryId),
    where("active", "==", true),
    orderBy("name"),
    limit(50),
  );
  const snapshot = await getDocs(productQuery);
  return snapshot.docs.map((document) => {
    const value = document.data();
    return {
      id: document.id,
      name: String(value.name),
      categoryId: String(value.categoryId),
      active: value.active === true,
      priceCents: Number(value.priceCents),
    };
  });
}`;
  }
  if (tool === "duckdb") {
    return `import { DuckDBInstance } from "@duckdb/node-api";

type ProductRow = { id: string; name: string; price_cents: number };
const instance = await DuckDBInstance.create(":memory:");
const connection = await instance.connect();

export async function listProducts(categoryId: string): Promise<ProductRow[]> {
  const statement = await connection.prepare(
    "SELECT id, name, price_cents FROM products WHERE category_id = $categoryId AND active = true ORDER BY name LIMIT 50",
  );
  statement.bindVarchar("categoryId", categoryId);
  const reader = await statement.runAndReadAll();
  return reader.getRowObjects() as ProductRow[];
}`;
  }
  return `type Product = { id: string; name: string; categoryId: string; active: boolean; priceCents: number };
type ProductQuery = {
  listActiveByCategory(input: {
    categoryId: string;
    orderBy: "name";
    limit: number;
  }): Promise<Product[]>;
};

export async function listProducts(database: ProductQuery, categoryId: string): Promise<Product[]> {
  if (!categoryId.trim()) throw new Error("category is required");
  return database.listActiveByCategory({
    categoryId,
    orderBy: "name",
    limit: 50,
  });
}`;
}

function aiSnippet(tool) {
  if (tool === "openai" || tool.startsWith("gpt-") || tool.startsWith("openai-")) {
    const model = {
      "gpt-4-1": "gpt-4.1",
      "openai-o1": "o1",
      "openai-o3": "o3",
      openai: "gpt-4o-mini",
    }[tool] ?? tool;
    return `import OpenAI from "openai";

type Product = { id: string; name: string; categoryId: string; priceCents: number };
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) throw new Error("OPENAI_API_KEY is required");
const client = new OpenAI({ apiKey });

export async function summarizeCatalogue(products: readonly Product[]) {
  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "${model}",
    temperature: 0.2,
    messages: [
      { role: "system", content: "Summarize only facts present in the supplied product data." },
      { role: "user", content: JSON.stringify(products) },
    ],
  });
  const summary = response.choices[0]?.message.content?.trim();
  if (!summary) throw new Error("The model returned an empty summary");
  return summary;
}`;
  }
  if (tool === "anthropic" || tool.startsWith("claude-")) {
    const model = {
      "claude-3-5-sonnet": "claude-3-5-sonnet-latest",
      "claude-3-7-sonnet": "claude-3-7-sonnet-latest",
    }[tool] ?? tool;
    return `import Anthropic from "@anthropic-ai/sdk";

type Product = { id: string; name: string; categoryId: string; priceCents: number };
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) throw new Error("ANTHROPIC_API_KEY is required");
const client = new Anthropic({ apiKey });

export async function summarizeCatalogue(products: readonly Product[]) {
  const response = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL ?? "${model}",
    max_tokens: 512,
    temperature: 0.2,
    system: "Summarize only facts present in the supplied product data.",
    messages: [{ role: "user", content: JSON.stringify(products) }],
  });
  const summary = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim();
  if (!summary) throw new Error("The model returned an empty summary");
  return summary;
}`;
  }
  if (
    tool === "autogen" ||
    tool === "crewai"
  ) {
    const adapterPath = tool === "autogen" ? "/api/agents/autogen/answer" : "/api/agents/crewai/answer";
    return `type Product = { id: string; name: string; categoryId: string; priceCents: number };
type AgentAnswer = { answer: string };

export async function answerProductQuestion(
  serviceUrl: string,
  question: string,
  categoryId: string,
  products: readonly Product[],
): Promise<string> {
  const response = await fetch(new URL("${adapterPath}", serviceUrl), {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ question, categoryId, products }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(\`Agent service failed: \${response.status}\`);
  const result = (await response.json()) as AgentAnswer;
  if (!result.answer.trim()) throw new Error("The agent returned an empty answer");
  return result.answer;
}`;
  }
  if (
    tool.startsWith("deepseek-") ||
    tool.startsWith("qwen") ||
    tool.startsWith("llama-") ||
    tool.startsWith("gemma-") ||
    tool === "phi-4" ||
    tool === "command-r-plus"
  ) {
    const provider =
      tool.startsWith("deepseek-")
        ? { baseUrl: "https://api.deepseek.com", key: "DEEPSEEK_API_KEY" }
        : tool.startsWith("qwen")
          ? {
              baseUrl: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
              key: "DASHSCOPE_API_KEY",
            }
          : {
              baseUrl: process.env.LOCAL_LLM_BASE_URL ?? "http://localhost:8000/v1",
              key: "LOCAL_LLM_API_KEY",
            };
    return `import OpenAI from "openai";

type Product = { id: string; name: string; categoryId: string; priceCents: number };
const apiKey = process.env.${provider.key};
if (!apiKey) throw new Error("${provider.key} is required");
const client = new OpenAI({
  baseURL: "${provider.baseUrl}",
  apiKey,
});

export async function summarizeCatalogue(products: readonly Product[]) {
  const response = await client.chat.completions.create({
    model: process.env.MODEL_ID ?? "${tool}",
    temperature: 0.2,
    messages: [
      { role: "system", content: "Summarize only facts present in the supplied product data." },
      { role: "user", content: JSON.stringify(products) },
    ],
  });
  const summary = response.choices[0]?.message.content?.trim();
  if (!summary) throw new Error("The model returned an empty summary");
  return summary;
}`;
  }
  if (tool === "ollama" || tool === "vllm") {
    const baseUrl = tool === "ollama" ? "http://localhost:11434/v1" : "http://localhost:8000/v1";
    return `import OpenAI from "openai";

type Product = { id: string; name: string; categoryId: string; priceCents: number };
const client = new OpenAI({
  baseURL: process.env.LLM_BASE_URL ?? "${baseUrl}",
  apiKey: process.env.LLM_API_KEY ?? "local-development",
});

export async function summarizeCatalogue(products: readonly Product[]) {
  const response = await client.chat.completions.create({
    model: process.env.LLM_MODEL ?? "local-model",
    temperature: 0.2,
    messages: [
      { role: "system", content: "Summarize only facts present in the supplied product data." },
      { role: "user", content: JSON.stringify(products) },
    ],
  });
  const summary = response.choices[0]?.message.content?.trim();
  if (!summary) throw new Error("The model returned an empty summary");
  return summary;
}`;
  }
  if (tool === "mistral" || tool.startsWith("mistral-")) {
    return `import { Mistral } from "@mistralai/mistralai";

type Product = { id: string; name: string; categoryId: string; priceCents: number };
const apiKey = process.env.MISTRAL_API_KEY;
if (!apiKey) throw new Error("MISTRAL_API_KEY is required");
const client = new Mistral({ apiKey });

export async function summarizeCatalogue(products: readonly Product[]) {
  const response = await client.chat.complete({
    model: process.env.MISTRAL_MODEL ?? "${tool === "mistral" ? "mistral-small-latest" : tool}",
    temperature: 0.2,
    messages: [
      { role: "system", content: "Summarize only facts present in the supplied product data." },
      { role: "user", content: JSON.stringify(products) },
    ],
  });
  const summary = response.choices?.[0]?.message?.content;
  if (typeof summary !== "string" || !summary.trim()) {
    throw new Error("The model returned an empty summary");
  }
  return summary.trim();
}`;
  }
  if (tool.startsWith("gemini-")) {
    const model = tool.replace(/^gemini-(\d)-(\d)-/u, "gemini-$1.$2-");
    return `import { GoogleGenAI } from "@google/genai";

type Product = { id: string; name: string; categoryId: string; priceCents: number };
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) throw new Error("GOOGLE_API_KEY is required");
const client = new GoogleGenAI({ apiKey });

export async function summarizeCatalogue(products: readonly Product[]) {
  const response = await client.models.generateContent({
    model: process.env.GEMINI_MODEL ?? "${model}",
    contents: \`Summarize only facts in this product data: \${JSON.stringify(products)}\`,
  });
  const summary = response.text?.trim();
  if (!summary) throw new Error("The model returned an empty summary");
  return summary;
}`;
  }
  if (tool === "pinecone") {
    return `import type { Index } from "@pinecone-database/pinecone";

type ProductMatch = { id: string; score?: number; metadata?: Record<string, string | number | boolean> };

export async function findCategoryProducts(index: Index, categoryId: string, embedding: number[]) {
  const result = await index.query({
    vector: embedding,
    topK: 50,
    filter: { categoryId: { $eq: categoryId }, active: { $eq: true } },
    includeMetadata: true,
  });
  return (result.matches ?? []) as ProductMatch[];
}`;
  }
  if (tool === "qdrant") {
    return `import type { QdrantClient } from "@qdrant/js-client-rest";

export async function findCategoryProducts(client: QdrantClient, categoryId: string, embedding: number[]) {
  const result = await client.search("products", {
    vector: embedding,
    limit: 50,
    filter: {
      must: [
        { key: "categoryId", match: { value: categoryId } },
        { key: "active", match: { value: true } },
      ],
    },
    with_payload: true,
  });
  return result.map(({ id, score, payload }) => ({ id, score, payload }));
}`;
  }
  if (tool === "weaviate") {
    return `import type { WeaviateClient } from "weaviate-client";

export async function findCategoryProducts(client: WeaviateClient, categoryId: string, embedding: number[]) {
  const collection = client.collections.get("Product");
  const result = await collection.query.nearVector(embedding, {
    filters: collection.filter
      .byProperty("categoryId").equal(categoryId)
      .and(collection.filter.byProperty("active").equal(true)),
    limit: 50,
    returnMetadata: ["distance"],
  });
  return result.objects.map(({ uuid, properties, metadata }) => ({ uuid, properties, metadata }));
}`;
  }
  if (tool === "chroma") {
    return `import type { Collection } from "chromadb";

export async function findCategoryProducts(collection: Collection, categoryId: string, embedding: number[]) {
  const result = await collection.query({
    queryEmbeddings: [embedding],
    nResults: 50,
    where: { categoryId, active: true },
    include: ["metadatas", "distances"],
  });
  return result.ids[0]?.map((id, index) => ({
    id,
    metadata: result.metadatas?.[0]?.[index],
    distance: result.distances?.[0]?.[index],
  })) ?? [];
}`;
  }
  if (["langchain", "llamaindex"].includes(tool)) {
    const method = tool === "langchain" ? "invoke" : "query";
    return `type Product = { id: string; name: string; categoryId: string; priceCents: number };
type CatalogueQuestion = {
  ${method}(input: { question: string; filter: { categoryId: string }; topK: number }): Promise<{ answer: string }>;
};

export async function answerCategoryQuestion(
  retriever: CatalogueQuestion,
  categoryId: string,
  question: string,
): Promise<string> {
  const result = await retriever.${method}({
    question,
    filter: { categoryId },
    topK: 5,
  });
  return result.answer;
}`;
  }
  const toolSlug = toPascalCase(tool);
  return `type Product = { id: string; name: string; categoryId: string; priceCents: number };
type ${toolSlug}CatalogueClient = {
  summarize(input: {
    instruction: string;
    products: readonly Product[];
    maxOutputTokens: number;
  }): Promise<{ text: string }>;
};

export async function summarizeCatalogue(
  client: ${toolSlug}CatalogueClient,
  products: readonly Product[],
): Promise<string> {
  const result = await client.summarize({
    instruction: "Summarize only facts present in the supplied product data.",
    products,
    maxOutputTokens: 512,
  });
  if (!result.text.trim()) throw new Error("The model returned an empty summary");
  return result.text.trim();
}`;
}

function devopsSnippet(tool, slug) {
  if (tool === "aws" && slug.includes("openfga")) {
    return `import * as aws from "@pulumi/aws";

const productImages = new aws.s3.BucketV2("product-images", {
  forceDestroy: false,
});
const accessPolicy = new aws.iam.Policy("product-image-reader", {
  description: "Allow the product catalogue service to read product images",
  policy: productImages.arn.apply((bucketArn) => JSON.stringify({
    Version: "2012-10-17",
    Statement: [{
      Effect: "Allow",
      Action: ["s3:GetObject"],
      Resource: [\`\${bucketArn}/*\`],
    }],
  })),
});
export const productImagePolicyArn = accessPolicy.arn;`;
  }
  if (tool === "aws") {
    return `import * as aws from "@pulumi/aws";

const productImages = new aws.s3.BucketV2("product-images", {
  forceDestroy: false,
  tags: { application: "product-catalog", dataClass: "public-media" },
});
new aws.s3.BucketPublicAccessBlock("product-images-public-access", {
  bucket: productImages.id,
  blockPublicAcls: true,
  blockPublicPolicy: true,
  ignorePublicAcls: true,
  restrictPublicBuckets: true,
});
export const productImageBucketName = productImages.bucket;`;
  }
  if (tool === "gcp") {
    return `import * as gcp from "@pulumi/gcp";

const productImages = new gcp.storage.Bucket("product-images", {
  location: "US",
  uniformBucketLevelAccess: true,
  publicAccessPrevention: "enforced",
  versioning: { enabled: true },
});
export const productImageBucketName = productImages.name;`;
  }
  if (tool === "azure") {
    return `import * as azure from "@pulumi/azure-native";
import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();
const resourceGroupName = config.require("resourceGroupName");
const account = new azure.storage.StorageAccount("product-media", {
  resourceGroupName,
  sku: { name: "Standard_LRS" },
  kind: "StorageV2",
  allowBlobPublicAccess: false,
  minimumTlsVersion: "TLS1_2",
});
export const productStorageAccountName = account.name;`;
  }
  if (tool === "cloudflare") {
    return `import * as cloudflare from "@pulumi/cloudflare";
import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();
const accountId = config.require("accountId");
const productImages = new cloudflare.R2Bucket("product-images", {
  accountId,
  name: "product-catalog-images",
  location: "WNAM",
});
export const productImageBucketName = productImages.name;`;
  }
  if (tool === "kubernetes") {
    return `import * as k8s from "@pulumi/kubernetes";

const appLabels = { app: "product-catalog" };
const deployment = new k8s.apps.v1.Deployment("product-catalog", {
  spec: {
    replicas: 2,
    selector: { matchLabels: appLabels },
    template: {
      metadata: { labels: appLabels },
      spec: {
        containers: [{
          name: "catalog",
          image: "registry.example.com/product-catalog:1.0.0",
          ports: [{ containerPort: 8080 }],
          resources: { requests: { cpu: "100m", memory: "128Mi" } },
          readinessProbe: { httpGet: { path: "/health", port: 8080 } },
        }],
      },
    },
  },
});
export const productCatalogDeployment = deployment.metadata.name;`;
  }
  if (tool === "terraform") {
    return `import { App, TerraformStack } from "cdktf";
import { S3Bucket } from "@cdktf/provider-aws/lib/s3-bucket";
import { S3BucketPublicAccessBlock } from "@cdktf/provider-aws/lib/s3-bucket-public-access-block";
import { Construct } from "constructs";

class ProductMediaStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const bucket = new S3Bucket(this, "productImages", {
      bucketPrefix: "product-catalog-images-",
      forceDestroy: false,
    });
    new S3BucketPublicAccessBlock(this, "privateImages", {
      bucket: bucket.id,
      blockPublicAcls: true,
      blockPublicPolicy: true,
      ignorePublicAcls: true,
      restrictPublicBuckets: true,
    });
  }
}

new ProductMediaStack(new App(), "product-media");`;
  }
  if (tool === "docker" || tool === "podman") {
    const runtimeLabel = tool === "podman" ? "Podman" : "Docker";
    return `import Docker from "dockerode";

const runtime = new Docker({
  socketPath: process.env.CONTAINER_SOCKET ?? "/var/run/docker.sock",
});

export async function runProductImageWorker(): Promise<void> {
  const container = await runtime.createContainer({
    Image: "registry.example.com/product-image-worker:1.0.0",
    Env: ["NODE_ENV=production"],
    HostConfig: {
      ReadonlyRootfs: true,
      NetworkMode: "product-catalog",
      Memory: 268_435_456,
      NanoCpus: 500_000_000,
    },
    Labels: { "app.name": "product-catalog", "app.runtime": "${runtimeLabel}" },
  });
  await container.start();
}`;
  }
  if (tool === "vercel" || tool === "netlify") {
    const deploymentEndpoint =
      tool === "vercel"
        ? "https://api.vercel.com/v13/deployments"
        : "https://api.netlify.com/api/v1/sites";
    return `type Deployment = { id: string; url?: string; state?: string };

export async function deployProductCatalog(): Promise<Deployment> {
  const token = process.env.DEPLOY_TOKEN;
  if (!token) throw new Error("DEPLOY_TOKEN is required");
  const response = await fetch("${deploymentEndpoint}", {
    method: "POST",
    headers: {
      authorization: \`Bearer \${token}\`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      name: "product-catalog",
      target: "production",
      source: { type: "git", ref: process.env.GIT_COMMIT_SHA },
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(\`Deployment request failed: \${response.status}\`);
  return (await response.json()) as Deployment;
}`;
  }
  if (tool === "nomad") {
    return `type NomadJob = {
  Job: {
    ID: string;
    Type: "service";
    TaskGroups: Array<{ Name: string; Count: number; Tasks: Array<{ Name: string; Driver: "docker" }> }>;
  };
};

export async function registerProductCatalogJob(address: string, token: string) {
  const job: NomadJob = {
    Job: {
      ID: "product-catalog",
      Type: "service",
      TaskGroups: [{
        Name: "api",
        Count: 2,
        Tasks: [{ Name: "catalog", Driver: "docker" }],
      }],
    },
  };
  const response = await fetch(new URL("/v1/jobs", address), {
    method: "POST",
    headers: { "content-type": "application/json", "X-Nomad-Token": token },
    body: JSON.stringify(job),
  });
  if (!response.ok) throw new Error(\`Nomad job registration failed: \${response.status}\`);
  return response.json();
}`;
  }
  if (tool === "openfga") {
    return `import { OpenFgaClient } from "@openfga/sdk";

const authorization = new OpenFgaClient({
  apiUrl: process.env.OPENFGA_API_URL!,
  storeId: process.env.OPENFGA_STORE_ID!,
  authorizationModelId: process.env.OPENFGA_MODEL_ID!,
});

export async function canListProducts(userId: string, categoryId: string): Promise<boolean> {
  const result = await authorization.check({
    user: \`user:\${userId}\`,
    relation: "viewer",
    object: \`category:\${categoryId}\`,
  });
  return result.allowed;
}`;
  }
  return `import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();
const region = config.require("region");
const productImages = new aws.s3.BucketV2("product-images", {
  forceDestroy: false,
  tags: { application: "product-catalog", region },
});
export const productImageBucketName = productImages.bucket;`;
}

function cssSnippet(tool) {
  const classes = {
    bootstrap: "card h-100 p-3",
    tailwind: "rounded-xl border border-slate-200 p-4 shadow-sm",
    "css-modules": "productCard",
    "styled-components": "ProductCard",
    "chakra-ui": "Card",
    mantine: "Card",
    shadcn: "Card",
  };
  if (tool === "chakra-ui") {
    return `import { Card, Heading, Text } from "@chakra-ui/react";

type Product = { name: string; priceCents: number };

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card.Root aria-label={product.name}>
      <Card.Body>
        <Heading size="md">{product.name}</Heading>
        <Text aria-label="Price">
          {(product.priceCents / 100).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </Text>
      </Card.Body>
    </Card.Root>
  );
}`;
  }
  if (tool === "mantine") {
    return `import { Card, Text, Title } from "@mantine/core";

type Product = { name: string; priceCents: number };

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card component="article" withBorder padding="md" radius="md">
      <Title order={2} size="h4">{product.name}</Title>
      <Text aria-label="Price" fw={600}>
        {(product.priceCents / 100).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      </Text>
    </Card>
  );
}`;
  }
  if (tool === "shadcn") {
    return `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Product = { name: string; priceCents: number };

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card>
      <CardHeader><CardTitle>{product.name}</CardTitle></CardHeader>
      <CardContent>
        <data value={(product.priceCents / 100).toFixed(2)}>
          {(product.priceCents / 100).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </data>
      </CardContent>
    </Card>
  );
}`;
  }
  if (tool === "styled-components") {
    return `import styled from "styled-components";

type Product = { name: string; priceCents: number };
const ProductCardShell = styled.article\`
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
\`;

export function ProductCard({ product }: { product: Product }) {
  return (
    <ProductCardShell aria-label={product.name}>
      <h2>{product.name}</h2>
      <data value={(product.priceCents / 100).toFixed(2)}>
        {(product.priceCents / 100).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      </data>
    </ProductCardShell>
  );
}`;
  }
  if (tool === "css-modules") {
    return `import styles from "./ProductCard.module.css";

type Product = { name: string; priceCents: number };

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className={styles.productCard} aria-label={product.name}>
      <h2 className={styles.name}>{product.name}</h2>
      <data className={styles.price} value={(product.priceCents / 100).toFixed(2)}>
        {(product.priceCents / 100).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      </data>
    </article>
  );
}`;
  }
  return `type Product = { name: string; priceCents: number };

export function productCardClassName(): string {
  return "${classes[tool] ?? "product-card"}";
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className={productCardClassName()} aria-label={product.name}>
      <h2>{product.name}</h2>
      <data value={(product.priceCents / 100).toFixed(2)}>
        {(product.priceCents / 100).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      </data>
    </article>
  );
}`;
}

function genericSnippet(tool) {
  return `type Product = { id: string; name: string; categoryId: string; active: boolean };

export async function list${toPascalCase(tool)}Products(
  endpoint: string,
  categoryId: string,
  signal?: AbortSignal,
): Promise<Product[]> {
  const url = new URL("/api/products", endpoint);
  url.searchParams.set("category", categoryId);
  url.searchParams.set("active", "true");
  url.searchParams.set("sort", "name");
  url.searchParams.set("limit", "50");
  const response = await fetch(url, { signal: signal ?? AbortSignal.timeout(5_000) });
  if (!response.ok) throw new Error(\`Product request failed: \${response.status}\`);
  const result = (await response.json()) as { products: Product[] };
  return result.products;
}`;
}

function toPascalCase(value) {
  return value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function createSnippet(tool, category, slug) {
  if (category === "frontend") return frontendSnippet(tool);
  if (category === "backend") return backendSnippet(tool);
  if (category === "databases") return databaseSnippet(tool);
  if (category === "ai-models") return aiSnippet(tool);
  if (category === "devops") return devopsSnippet(tool, slug);
  if (category === "css") return cssSnippet(tool);
  return genericSnippet(tool);
}

function getScenario(locale, category, slug = "") {
  if (category === "devops" && slug.includes("openfga")) {
    const accessControlScenario = {
      pl: "Chroń obrazy katalogu produktów: skonfiguruj dostęp IAM do obiektów albo sprawdź relację uprawnień użytkownika przed odczytem.",
      en: "Protect product-catalogue images: grant IAM object access or check a user's relationship-based permission before reading.",
      es: "Protege las imágenes del catálogo: concede acceso IAM a los objetos o comprueba la relación de permisos antes de leer.",
      de: "Schütze Katalogbilder: Gewähre IAM-Objektzugriff oder prüfe vor dem Lesen die beziehungsbasierte Berechtigung.",
      fr: "Protégez les images du catalogue : accordez l’accès IAM aux objets ou vérifiez l’autorisation relationnelle avant la lecture.",
    };
    return accessControlScenario[locale] ?? accessControlScenario.en;
  }
  const scenario = categoryScenarios[locale]?.[category] ?? categoryScenarios.en.general;
  if (
    category === "backend" &&
    /(?:go-gin|actix-web|fastapi|python)/u.test(slug)
  ) {
    const typedClientNote = {
      pl: "Ponieważ wybrany backend nie jest oparty na TypeScript, przykład pokazuje typowanego klienta HTTP; kod serwera pozostaje w języku danego frameworka.",
      en: "Because one backend is not TypeScript-based, its example is a typed HTTP client; the server implementation remains in that framework's native language.",
      es: "Como uno de los backends no usa TypeScript, su ejemplo es un cliente HTTP tipado; el servidor sigue escrito en el lenguaje nativo del framework.",
      de: "Da eines der Backends nicht auf TypeScript basiert, zeigt das Beispiel einen typisierten HTTP-Client; der Server bleibt in der nativen Sprache des Frameworks.",
      fr: "Comme l’un des backends n’est pas basé sur TypeScript, l’exemple montre un client HTTP typé ; le serveur reste écrit dans le langage natif du framework.",
    };
    return `${scenario} ${typedClientNote[locale] ?? typedClientNote.en}`;
  }
  if (category === "ai-models" && /(?:autogen|crewai)/u.test(slug)) {
    const agentBridgeNote = {
      pl: "Przykład TypeScript wywołuje własną warstwę HTTP dla frameworka agentowego; jego implementacja działa w natywnym środowisku frameworka.",
      en: "The TypeScript example calls an application-owned HTTP adapter for the agent framework; the agent implementation runs in its native environment.",
      es: "El ejemplo TypeScript llama a un adaptador HTTP propio para el framework de agentes; la implementación del agente se ejecuta en su entorno nativo.",
      de: "Das TypeScript-Beispiel ruft einen eigenen HTTP-Adapter für das Agenten-Framework auf; die Agentenimplementierung läuft in dessen nativer Umgebung.",
      fr: "L’exemple TypeScript appelle un adaptateur HTTP applicatif pour le framework d’agents ; l’agent s’exécute dans son environnement natif.",
    };
    return `${scenario} ${agentBridgeNote[locale] ?? agentBridgeNote.en}`;
  }
  return scenario;
}

function createCodeExamples(slug, category, locale = "en") {
  const [toolA, toolB] = slug.split("-vs-");
  if (!toolA || !toolB) {
    throw new TypeError(`Invalid comparison slug for code examples: ${slug}`);
  }
  if (!categoryScenarios.en[category]) {
    throw new TypeError(`Unknown code example category "${category}" for ${slug}`);
  }
  return {
    scenario: getScenario(locale, category, slug),
    tech1Snippet: createSnippet(toolA, category, slug),
    tech2Snippet: createSnippet(toolB, category, slug),
  };
}

module.exports = { createCodeExamples, getScenario, scenarios };
