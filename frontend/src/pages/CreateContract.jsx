import React from "react";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { CreateContractForm } from "../components/create-contract-form";

const CreateContract = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <CreateContractForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateContract;