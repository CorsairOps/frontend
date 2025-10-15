import {Typography, Container, Box, Button} from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Image from "next/image";
import Link from "next/link";

export default function Home() {

  return (
    <div className="pt-24 p-8 w-full min-h-screen">
      <Box>
        <Image src="/hero.jpg" objectFit="cover" objectPosition="center" fill={true} alt="Navy Warship"
               className="brightness-40"
        />
        <div className="absolute w-full h-full flex flex-col justify-center top-0 left-0">
          <Container maxWidth="lg"
                     className="z-10"
                     sx={{
                       color: 'white'
                     }}
          >
            <Typography variant="h1" sx={{
              fontSize: {xs: '2rem', md: '3rem', lg: '4rem'},
              fontWeight: 'bold'
            }}>
              High Performance Naval Ops Solutions
            </Typography>
            <Typography variant="subtitle1" sx={{
              fontSize: {xs: '1rem', md: '1.5rem'},
              fontWeight: '600',
              mb: 2
            }}>
              Empowering Naval Operations with Cutting-Edge Technology
            </Typography>
            <Typography variant="body1">
              CorsairOps is dedicated to providing state-of-the-art software solutions tailored for naval operations.
              We specialize in developing applications that streamline communication, improve situational awareness, and
              optimize resource
              management for naval forces worldwide.
              Our
              mission is to enhance the efficiency, safety, and effectiveness of naval missions through innovative
              technology. TESTS
            </Typography>

            <Box className="mt-4 flex space-x-4 items-center">
              <Link href="/contact">
                <Button variant="contained" color="primary">
                  <CalendarMonthIcon className="mr-2"/>
                  Book a Demo
                </Button>
              </Link>
            </Box>
          </Container>
        </div>
      </Box>
    </div>
  );
}