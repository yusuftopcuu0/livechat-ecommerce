import { useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";

import kirmiziTshirt from "../images/kirmizi-tshirt.jpeg";
import siyahAyakkabi from "../images/siyah-ayakkabi.jpeg";
import maviKotPantolon from "../images/mavi-kot-pantolon.jpeg";
// import { Logout } from "@mui/icons-material";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import { signOut } from "firebase/auth";
// import { auth } from "../firebaseConfig";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Kırmızı Tişört",
    price: 199,
    image: kirmiziTshirt,
  },
  {
    id: 2,
    name: "Siyah Ayakkabı",
    price: 499,
    image: siyahAyakkabi,
  },
  {
    id: 3,
    name: "Mavi Kot Pantolon",
    price: 299,
    image: maviKotPantolon,
  },
];

export default function HomePage() {
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = () => {
    setCartCount(cartCount + 1);
  };

  return (
    <>
      {/* Header */}
      {/* <AppBar position="static">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">🛍️ E-Shop</Typography>

          <Box>
            <IconButton color="inherit" onClick={() => setChatOpen(!chatOpen)}>
              <ChatIcon />
            </IconButton>
            <IconButton color="inherit">
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <Button color="inherit" onClick={handleLogout}>
              <Logout />
            </Button>
          </Box>
        </Toolbar>
      </AppBar> */}

      {/* Ürün Listesi */}
      <Grid container spacing={2} sx={{ p: 2, marginTop: "65px" }}>
        {products.map((product) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
                sx={{
                  objectFit: "contain",
                  width: "100%",
                  height: "200px",
                  p: 1,
                  bgcolor: "background.paper",
                }}
              />
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body1">{product.price} TL</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddToCart}
                  sx={{ mt: 1 }}
                >
                  Sepete Ekle
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
