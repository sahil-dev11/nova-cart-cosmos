import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowLeft, ShoppingCart } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  if (!product) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Product not found</h2>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link to="/products">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="overflow-hidden rounded-lg bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <Badge variant="secondary" className="mb-4 w-fit">
              {product.category}
            </Badge>
            
            <h1 className="mb-4 text-4xl font-bold">{product.name}</h1>

            <div className="mb-4 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <span className="text-lg font-medium">{product.rating}</span>
              </div>
              <span className="text-muted-foreground">
                • {product.stock} units available
              </span>
            </div>

            <p className="mb-6 text-4xl font-bold text-primary">${product.price}</p>

            <p className="mb-8 text-lg leading-relaxed text-foreground">
              {product.description}
            </p>

            <div className="mt-auto flex gap-4">
              <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Link to="/cart" className="flex-1">
                <Button size="lg" variant="outline" className="w-full">
                  View Cart
                </Button>
              </Link>
            </div>

            <div className="mt-8 rounded-lg border bg-card p-6">
              <h3 className="mb-4 text-xl font-semibold">Product Details</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Category:</dt>
                  <dd className="font-medium">{product.category}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Stock:</dt>
                  <dd className="font-medium">{product.stock} units</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Rating:</dt>
                  <dd className="font-medium">{product.rating}/5.0</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
