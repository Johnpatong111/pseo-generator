const scenarios = {
  pl: "Wspólne zadanie: pobierz i zwróć produkty z aktywnej kategorii.",
  en: "Shared task: load and return products from the selected category.",
  es: "Tarea común: cargar y devolver los productos de la categoría seleccionada.",
  de: "Gemeinsame Aufgabe: Produkte der ausgewählten Kategorie laden und zurückgeben.",
  fr: "Tâche commune : charger et renvoyer les produits de la catégorie sélectionnée.",
};

const productType = `type Product = {
  id: string;
  name: string;
  categoryId: string;
  active: boolean;
  priceCents: number;
};`;

function frontendSnippet(tool, slug, side) {
  if (
    (slug.includes("nextjs") && slug.includes("remix")) ||
    (slug.includes("remix") && slug.includes("nextjs"))
  ) {
    if (tool === "remix") {
      return `import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

type Product = { id: string; name: string; categoryId: string; active: boolean };

export async function loader({ request }: { request: Request }) {
  const categoryId = new URL(request.url).searchParams.get("category");
  if (!categoryId) throw new Response("Missing category", { status: 400 });
  const products = await productRepository.listActiveByCategory(categoryId);
  return json({ products });
}

export default function ProductRoute() {
  const { products } = useLoaderData<typeof loader>();
  return <ul>{products.map((product) => <li key={product.id}>{product.name}</li>)}</ul>;
}`;
    }

    return `type Product = { id: string; name: string; categoryId: string; active: boolean };

export default async function ProductPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  if (!category) throw new Error("Missing category");
  const products = await productRepository.listActiveByCategory(category);
  return <ul>{products.map((product: Product) => <li key={product.id}>{product.name}</li>)}</ul>;
}`;
  }

  if (tool === "react") {
    return `import type { ReactNode } from "react";

${productType}

type ProductListProps = { products: Product[]; categoryId: string };

export function ProductList({ products, categoryId }: ProductListProps): ReactNode {
  const visible = products.filter(
    (product) => product.active && product.categoryId === categoryId,
  );
  return <ul>{visible.map((product) => <li key={product.id}>{product.name}</li>)}</ul>;
}`;
  }
  if (["vue", "nuxt"].includes(tool)) {
    return `<script setup lang="ts">
import { computed } from "vue";

${productType}

const props = defineProps<{ products: Product[]; categoryId: string }>();
const visibleProducts = computed(() =>
  props.products.filter(
    (product) => product.active && product.categoryId === props.categoryId,
  ),
);
</script>

<template>
  <ul>
    <li v-for="product in visibleProducts" :key="product.id">{{ product.name }}</li>
  </ul>
</template>`;
  }
  if (tool === "svelte") {
    return `<script lang="ts">
  ${productType}
  export let products: Product[];
  export let categoryId: string;

  $: visibleProducts = products.filter(
    (product) => product.active && product.categoryId === categoryId,
  );
</script>

<ul>
  {#each visibleProducts as product (product.id)}
    <li>{product.name}</li>
  {/each}
</ul>`;
  }
  if (tool === "angular") {
    return `import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

${productType}

@Component({
  selector: "app-product-list",
  standalone: true,
  imports: [CommonModule],
  template: \`<ul><li *ngFor="let product of visibleProducts">{{ product.name }}</li></ul>\`,
})
export class ProductListComponent {
  @Input({ required: true }) products: Product[] = [];
  @Input({ required: true }) categoryId = "";

  get visibleProducts(): Product[] {
    return this.products.filter(
      (product) => product.active && product.categoryId === this.categoryId,
    );
  }
}`;
  }
  if (["solidjs", "solid"].includes(tool)) {
    return `import { createMemo, For } from "solid-js";

${productType}

export function ProductList(props: { products: Product[]; categoryId: string }) {
  const visible = createMemo(() =>
    props.products.filter(
      (product) => product.active && product.categoryId === props.categoryId,
    ),
  );
  return <ul><For each={visible()}>{(product) => <li>{product.name}</li>}</For></ul>;
}`;
  }

  return `${productType}

export function listProducts(
  products: Product[],
  categoryId: string,
): Product[] {
  return products
    .filter((product) => product.active && product.categoryId === categoryId)
    .sort((left, right) => left.name.localeCompare(right.name));
}`;
}

function backendSnippet(tool) {
  if (tool === "express") {
    return `import express from "express";

type Product = { id: string; name: string; categoryId: string; active: boolean };
const app = express();

app.get("/api/products", async (request, response, next) => {
  try {
    const categoryId = String(request.query.category ?? "");
    if (!categoryId) return response.status(400).json({ error: "category is required" });
    const products: Product[] = await productRepository.listActiveByCategory(categoryId);
    return response.json({ products });
  } catch (error) {
    return next(error);
  }
});`;
  }
  if (tool === "fastify") {
    return `import Fastify from "fastify";

type Product = { id: string; name: string; categoryId: string; active: boolean };
const app = Fastify();

app.get<{ Querystring: { category?: string } }>("/api/products", async (request, reply) => {
  const categoryId = request.query.category;
  if (!categoryId) return reply.code(400).send({ error: "category is required" });
  const products: Product[] = await productRepository.listActiveByCategory(categoryId);
  return { products };
});`;
  }
  if (tool === "hono") {
    return `import { Hono } from "hono";

type Product = { id: string; name: string; categoryId: string; active: boolean };
const app = new Hono();

app.get("/api/products", async (context) => {
  const categoryId = context.req.query("category");
  if (!categoryId) return context.json({ error: "category is required" }, 400);
  const products: Product[] = await productRepository.listActiveByCategory(categoryId);
  return context.json({ products });
});`;
  }
  if (tool === "nestjs") {
    return `import { Controller, Get, Query, BadRequestException } from "@nestjs/common";

type Product = { id: string; name: string; categoryId: string; active: boolean };

@Controller("api/products")
export class ProductsController {
  @Get()
  async list(@Query("category") categoryId?: string): Promise<{ products: Product[] }> {
    if (!categoryId) throw new BadRequestException("category is required");
    const products = await productRepository.listActiveByCategory(categoryId);
    return { products };
  }
}`;
  }
  if (tool === "nextjs") {
    return `import { NextRequest, NextResponse } from "next/server";

type Product = { id: string; name: string; categoryId: string; active: boolean };

export async function GET(request: NextRequest) {
  const categoryId = request.nextUrl.searchParams.get("category");
  if (!categoryId) {
    return NextResponse.json({ error: "category is required" }, { status: 400 });
  }
  const products: Product[] = await productRepository.listActiveByCategory(categoryId);
  return NextResponse.json({ products });
}`;
  }

  return `import type { IncomingMessage, ServerResponse } from "node:http";

type Product = { id: string; name: string; categoryId: string; active: boolean };

export async function listProducts(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> {
  const categoryId = new URL(request.url ?? "/", "http://localhost").searchParams.get("category");
  if (!categoryId) {
    response.statusCode = 400;
    response.end(JSON.stringify({ error: "category is required" }));
    return;
  }
  const products: Product[] = await productRepository.listActiveByCategory(categoryId);
  response.setHeader("content-type", "application/json");
  response.end(JSON.stringify({ products }));
}`;
}

function databaseSnippet(tool) {
  if (tool === "prisma") {
    return `import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const products = await prisma.product.findMany({
  where: { categoryId, active: true },
  select: { id: true, name: true, priceCents: true },
  orderBy: { name: "asc" },
  take: 50,
});

await prisma.$disconnect();`;
  }
  if (tool === "drizzle") {
    return `import { and, asc, eq } from "drizzle-orm";
import { db } from "./db";
import { products } from "./schema";

const rows = await db
  .select({ id: products.id, name: products.name, priceCents: products.priceCents })
  .from(products)
  .where(and(eq(products.categoryId, categoryId), eq(products.active, true)))
  .orderBy(asc(products.name))
  .limit(50);`;
  }
  if (tool === "mongoose") {
    return `import { ProductModel } from "./models/product";

const products = await ProductModel.find({
  categoryId,
  active: true,
})
  .select({ name: 1, priceCents: 1 })
  .sort({ name: 1 })
  .limit(50)
  .lean()
  .exec();`;
  }
  if (tool === "typeorm") {
    return `import { AppDataSource } from "./data-source";
import { Product } from "./entities/product";

const products = await AppDataSource.getRepository(Product).find({
  where: { categoryId, active: true },
  select: { id: true, name: true, priceCents: true },
  order: { name: "ASC" },
  take: 50,
});`;
  }
  if (["supabase", "astra-db"].includes(tool)) {
    return `import { createClient } from "@supabase/supabase-js";

const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const { data: products, error } = await db
  .from("products")
  .select("id, name, price_cents")
  .eq("category_id", categoryId)
  .eq("active", true)
  .order("name")
  .limit(50);

if (error) throw new Error(\`Product query failed: \${error.message}\`);`;
  }
  if (["firebase", "firestore"].includes(tool)) {
    return `import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { db } from "./firebase";

const productQuery = query(
  collection(db, "products"),
  where("categoryId", "==", categoryId),
  where("active", "==", true),
  orderBy("name"),
  limit(50),
);
const snapshot = await getDocs(productQuery);
const products = snapshot.docs.map((document) => ({
  id: document.id,
  ...document.data(),
}));`;
  }
  return `type Product = { id: string; name: string; categoryId: string; active: boolean };
type ProductDatabase = {
  query<T>(sql: string, values: readonly unknown[]): Promise<{ rows: T[] }>;
};

export async function listProducts(database: ProductDatabase, categoryId: string) {
  const result = await database.query<Product>(
    "SELECT id, name, category_id AS \\"categoryId\\", active FROM products WHERE category_id = $1 AND active = TRUE ORDER BY name LIMIT 50",
    [categoryId],
  );
  return result.rows;
}`;
}

function aiSnippet(tool) {
  if (["ollama", "vllm"].includes(tool)) {
    const baseURL =
      tool === "ollama"
        ? "http://localhost:11434/v1"
        : "http://localhost:8000/v1";
    return `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "${baseURL}",
  apiKey: process.env.LOCAL_LLM_API_KEY ?? "local-development",
});

const response = await client.chat.completions.create({
  model: process.env.MODEL_NAME!,
  messages: [
    { role: "system", content: "Summarize product data accurately." },
    { role: "user", content: JSON.stringify(products) },
  ],
  temperature: 0.2,
});
const summary = response.choices[0]?.message.content ?? "";`;
  }
  if (["openai", "gpt-4o", "gpt-4o-mini", "gpt-4-1", "openai-o1", "openai-o3"].includes(tool)) {
    return `import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const response = await client.chat.completions.create({
  model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
  messages: [
    { role: "system", content: "Summarize product data accurately." },
    { role: "user", content: JSON.stringify(products) },
  ],
  temperature: 0.2,
});
const summary = response.choices[0]?.message.content ?? "";`;
  }
  if (["anthropic", "claude-3-5-sonnet", "claude-3-7-sonnet", "claude-fable-5-1", "claude-opus-5-5"].includes(tool)) {
    return `import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const response = await client.messages.create({
  model: process.env.ANTHROPIC_MODEL!,
  max_tokens: 512,
  system: "Summarize product data accurately.",
  messages: [{ role: "user", content: JSON.stringify(products) }],
});
const summary = response.content
  .filter((block) => block.type === "text")
  .map((block) => block.text)
  .join("");`;
  }
  return `type Product = { id: string; name: string; categoryId: string; priceCents: number };
type ModelClient = {
  summarize(input: { instruction: string; data: Product[] }): Promise<string>;
};

export async function summarizeProducts(
  client: ModelClient,
  products: Product[],
  categoryId: string,
): Promise<string> {
  return client.summarize({
    instruction: "Summarize this product list using only the supplied facts.",
    data: products.filter((product) => product.categoryId === categoryId),
  });
}`;
}

function devopsSnippet(tool) {
  if (["aws", "gcp", "azure"].includes(tool)) {
    const resource =
      tool === "aws"
        ? `import * as aws from "@pulumi/aws";

const productsBucket = new aws.s3.BucketV2("products", {
  versioning: { enabled: true },
  tags: { purpose: "product-catalog" },
});`
        : tool === "gcp"
          ? `import * as gcp from "@pulumi/gcp";

const productsBucket = new gcp.storage.Bucket("products", {
  location: "US",
  uniformBucketLevelAccess: true,
});`
          : `import * as azure from "@pulumi/azure-native";

const productsStorage = new azure.storage.StorageAccount("products", {
  resourceGroupName: resourceGroup.name,
  sku: { name: "Standard_LRS" },
  kind: "StorageV2",
});`;
    const resourceId = tool === "azure" ? "productsStorage.id" : "productsBucket.id";
    return `import * as pulumi from "@pulumi/pulumi";
${resource}

export const productStorageId = ${resourceId};`;
  }
  if (tool === "cloudflare") {
    return `import * as cloudflare from "@pulumi/cloudflare";

const productsBucket = new cloudflare.R2Bucket("products", {
  name: "product-catalog",
  location: "WNAM",
});

export const productStorageId = productsBucket.id;`;
  }
  if (tool === "azure") {
    return `import * as azure from "@pulumi/azure-native";

const productsStorage = new azure.storage.StorageAccount("products", {
  resourceGroupName: resourceGroup.name,
  sku: { name: "Standard_LRS" },
  kind: "StorageV2",
});

export const productStorageId = productsStorage.id;`;
  }
  if (tool === "gcp") {
    return `import * as gcp from "@pulumi/gcp";

const productsBucket = new gcp.storage.Bucket("products", {
  location: "US",
  uniformBucketLevelAccess: true,
});

export const productStorageId = productsBucket.id;`;
  }
  return `import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const productsBucket = new aws.s3.BucketV2("products", {
  versioning: { enabled: true },
  tags: { purpose: "product-catalog" },
});

export const productStorageId = productsBucket.id;`;
}

function cssSnippet(tool) {
  const styles =
    tool === "tailwind" || tool === "tailwindcss"
      ? `className="grid gap-3 rounded-xl border border-slate-200 p-4 shadow-sm"`
      : tool === "bootstrap"
        ? `className="card d-grid gap-2 p-3 shadow-sm"`
        : tool === "css-modules"
          ? `className={styles.productCard}`
          : tool === "styled-components"
            ? `className="product-card"`
          : `className="product-card"`;
  const imports =
    tool === "css-modules"
      ? `import styles from "./ProductCard.module.css";\n\n`
      : tool === "styled-components"
        ? `import styled from "styled-components";\n\nconst ProductCardShell = styled.article\`\n  display: grid;\n  gap: 0.75rem;\n  padding: 1rem;\n  border: 1px solid #cbd5e1;\n  border-radius: 0.75rem;\n\`;\n\n`
        : "";
  const element =
    tool === "styled-components"
      ? "<ProductCardShell aria-label={product.name}>"
      : `<article ${styles} aria-label={product.name}>`;
  const closeElement = tool === "styled-components" ? "</ProductCardShell>" : "</article>";
  return `${imports}type Product = { id: string; name: string; priceCents: number };

export function ProductCard({ product }: { product: Product }) {
  return (
    ${element}
      <h2>{product.name}</h2>
      <data value={(product.priceCents / 100).toFixed(2)}>
        \${(product.priceCents / 100).toFixed(2)}
      </data>
    ${closeElement}
  );
}`;
}

function genericSnippet(tool) {
  return `type Product = { id: string; name: string; categoryId: string; active: boolean };

export async function listActiveProducts(categoryId: string): Promise<Product[]> {
  const response = await fetch(
    \`/api/products?category=\${encodeURIComponent(categoryId)}&active=true\`,
    { headers: { accept: "application/json" } },
  );
  if (!response.ok) {
    throw new Error(\`Product request failed with status \${response.status}\`);
  }
  const payload: { products: Product[] } = await response.json();
  return payload.products;
}`;
}

function createSnippet(tool, category, slug) {
  if (category === "frontend") return frontendSnippet(tool, slug);
  if (category === "backend") return backendSnippet(tool);
  if (category === "databases") return databaseSnippet(tool);
  if (category === "ai-models") return aiSnippet(tool);
  if (category === "devops") return devopsSnippet(tool);
  if (category === "css") return cssSnippet(tool);
  return genericSnippet(tool);
}

function createCodeExamples(slug, category) {
  const [toolA, toolB] = slug.split("-vs-");
  if (!toolA || !toolB) {
    throw new TypeError(`Invalid comparison slug for code examples: ${slug}`);
  }
  return {
    tech1Snippet: createSnippet(toolA, category, slug),
    tech2Snippet: createSnippet(toolB, category, slug),
  };
}

module.exports = { createCodeExamples, scenarios };
