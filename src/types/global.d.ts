declare module "*.png";
declare module "*.jpg";
declare module "*.webp";

declare module "*.css" {
  const content: { [className: string]: string };
  export = content;
}