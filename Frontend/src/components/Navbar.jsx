import React from "react";
import {
  Box,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  VStack,
  useDisclosure,
  useBreakpointValue,
  Image,
  Center,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Link, useLocation } from "react-router-dom";
import teaLogo from "../assets/teatfac.png"; // Adjust path if needed

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isDesktop = useBreakpointValue({ base: false, md: true });
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Dashboard" },
    { to: "/report", label: "Reports" },
    { to: "/income", label: "Income", hideOnMobile: true },
    { to: "/expense", label: "Expense", hideOnMobile: true },
    { to: "/budget", label: "Budget", hideOnMobile: true },
  ];

  return (
    <Box
      as="nav"
      bg="brand.700"
      color="white"
      px={{ base: 4, md: 8 }}
      py={4}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      boxShadow="navbar"
      position="relative"
    >
      <span className="font-bold text-2xl tracking-wide flex items-center">
        {/* Logo - always in a circle */}
        <Box
          boxSize={{ base: "40px", md: "44px" }}
          borderRadius="full"
          overflow="hidden"
          borderWidth="2px"
          borderColor="white"
          bg="white"
          display="flex"
          alignItems="center"
          justifyContent="center"
          mr={2}
        >
          <Image
            src={teaLogo}
            alt="Tea Logo"
            boxSize={{ base: "34px", md: "38px" }}
            objectFit="cover"
          />
        </Box>
        Newlands Tea Factory
      </span>
      {/* Desktop Nav */}
      <Box
        className="font-medium"
        display={{ base: "none", md: "flex" }}
        alignItems="center"
      >
        {navLinks.map(
          (nav) =>
            (!nav.hideOnMobile || isDesktop) && (
              <Link
                key={nav.to}
                to={nav.to}
                className={`hover:underline hover:text-green-300 transition mx-2 ${
                  location.pathname === nav.to ? "underline text-[#a7e3b6] font-bold" : ""
                }`}
              >
                {nav.label}
              </Link>
            )
        )}
        <span className="ml-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
        </span>
      </Box>
      {/* Mobile Hamburger */}
      <IconButton
        aria-label="Open Menu"
        icon={<HamburgerIcon />}
        display={{ base: "flex", md: "none" }}
        variant="ghost"
        color="white"
        fontSize="2xl"
        onClick={onOpen}
      />
      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="brand.700" color="white">
          <DrawerCloseButton mt={2} />
          <DrawerBody>
            <Center mt={10} mb={4}>
              <Box
                boxSize="70px"
                borderRadius="full"
                overflow="hidden"
                borderWidth="3px"
                borderColor="white"
                bg="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="lg"
              >
                <Image
                  src={teaLogo}
                  alt="Tea Logo"
                  boxSize="60px"
                  objectFit="cover"
                />
              </Box>
            </Center>
            <Center mb={8} fontWeight="bold" fontSize="xl" letterSpacing="wide">
              Newlands Tea Factory
            </Center>
            <VStack spacing={6} align="stretch">
              {navLinks.map((nav) => (
                <Link
                  key={nav.to}
                  to={nav.to}
                  className={`hover:underline hover:text-green-300 transition text-lg ${
                    location.pathname === nav.to ? "underline text-[#a7e3b6] font-bold" : ""
                  }`}
                  onClick={onClose}
                >
                  {nav.label}
                </Link>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
