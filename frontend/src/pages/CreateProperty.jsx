import React from "react";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { CreatePropertyForm } from "../components/create-property-form";

const CreateProperty = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <CreatePropertyForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateProperty;