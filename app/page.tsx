import Navbar from "@/components/LandingNavbar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Navbar />
      <h1 className="text-4xl font-heading">Faceless Labs</h1>
      <p className="text-lg font-base">
        Faceless Labs is a software development company that let you create a
        faceless avatar with a picture of your face.
      </p>
      <p className="text-lg font-base">
        We use AI to create the avatar and you can use it for your social media
        profiles.
      </p>
      <Link href="/app">
        <Button className="mt-4">Get Started</Button>
      </Link>
    </div>
  );
}
