"use client";
import Image from "next/image";
import { CarCard, Hero, ShowMore } from "@/components";
import SearchBar from "@/components/SearchBar";
import CustomFilter from "@/components/CustomFilter";
import { fetchCars } from "@/utils";
import { fuels, yearsOfProduction } from "@/constants";
import { useEffect, useState } from "react";

export default function Home() {
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(false);

  //search states
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");

  //filter states
  const [fuel, setFuel] = useState("");
  const [year, setYear] = useState(2022);

  //pagination states
  const [limit, setLimit] = useState(10);

  const getCars = async () => {
    try {
      setLoading(true);
      const result = await fetchCars({
        manufacturer: manufacturer || "",
        year: year || "2022",
        fuel: fuel || "",
        limit: limit || "10",
        model: model || "",
      });
      setAllCars(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getCars();
  }, [fuel, model, manufacturer, year, limit]);

  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;
  return (
    <main className="overflow-hidden">
      <Hero />
      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Car Catlog</h1>
          <p>Explore the car you might like</p>
        </div>
        <div className="home__filters">
          <SearchBar setManufacturer={setManufacturer} setModel={setModel} />
          <div className="home__filter-container">
            <CustomFilter title="fuel" options={fuels} setFilter={setFuel} />
            <CustomFilter
              title="year"
              options={yearsOfProduction}
              setFilter={setYear}
            />
          </div>
        </div>
        {allCars.length > 0 ? (
          <section>
            <div className="home__cars-wrapper">
              {allCars?.map((car) => (
                <CarCard car={car} />
              ))}
            </div>
            {loading && (
              <div className="mt-16 w-full flex-center">
                <Image
                  src="/loader.svg"
                  alt="loader"
                  width={50}
                  height={50}
                  className="object-contain"
                />
              </div>
            )}
            <ShowMore
              pageNumber={(limit || 10) / 10}
              isNext={limit > allCars.length}
              setLimit={setLimit}
            ></ShowMore>
          </section>
        ) : (
          <div className="home__error-container">
            <h2 className="text-black text-xl font-bold">Oops, no result</h2>
            <p>{allCars?.message}</p>
          </div>
        )}
      </div>
    </main>
  );
}
