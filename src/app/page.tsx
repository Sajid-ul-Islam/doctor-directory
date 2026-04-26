import Papa from "papaparse";
import { Doctor } from "../../types";
import DoctorList from "./DoctorList";

async function getDoctorsData(): Promise<Doctor[]> {
  const sheetId = "1C2TSME8WcmcRpGXkKbGAkBgXS_7VAmSSCg6WfiJh_O8";
  const gid = "799451496";
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;

  try {
    // Fetches fresh data and caches it for 60 seconds.
    const response = await fetch(csvUrl, { next: { revalidate: 60 } });
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    const csvText = await response.text();
    
    // Parse the CSV
    const parsed = Papa.parse<any>(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    // Map the raw Google Sheet rows to our Doctor interface.
    // This safely checks for common column name variations, including Bengali ones.
    const validDoctors: Doctor[] = parsed.data.map((row) => {
      const name = row["Name"] || row["Doctor Name"] || row["name"] || row["ডাক্তারের নাম:"] || "";
      const district = row["আপনার জেলা:"] || "";
      const address = row["Location"] || row["Address"] || row["City"] || row["ডাক্তারের চেম্বার এড্রেস:"] || "";
      const location = [address, district].filter(Boolean).join(", ");
      
      return {
        Name: name,
        Specialty: row["Specialty"] || row["Specialization"] || row["specialty"] || "Gynecologist & Obstetrician",
        Location: location,
        Phone: row["Phone"] || row["Phone Number"] || row["Contact"] || "",
        Email: row["Email"] || row["Email Address"] || row["email"] || "",
        Vbac: row["উনি কি ভিব্যাক(সিজারের পর নরমাল ডেলিভারি)  করান? "] || "",
        Presence: row["আপনার নরমাল ডেলিভারির সময় কি ডাক্তার নিজে উপস্থিত ছিলেন? সব রোগীর ক্ষেত্রেই কি থাকেন?"] || "",
        Purdah: row["আপনার উল্লিখিত ডাক্তার কি পর্দার ব্যাপারে সহযোগী?"] || "",
        Interventions: row["এই ডাক্তার কি মেডিকেল হস্তক্ষেপ (নিয়মমাফিক সব মাকে পিটোসিন, এপিসিওটমি দেয়া) সহ নরমাল ডেলিভারি করান নাকি আপডেটেড গাইডলাইন অনুযায়ী শুধু প্রয়োজন হলেই এসব ব্যবহার করেন? "] || "",
      };
    }).filter(doc => doc.Name !== ""); // Filter out completely empty rows

    return validDoctors;
  } catch (error) {
    console.error("Error fetching sheet data:", error);
    return []; 
  }
}

export default async function Home() {
  const doctors = await getDoctorsData();

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Specialist Directory
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our carefully curated directory of medical professionals. Search by name, specialty, or location to find the perfect care provider for your needs.
          </p>
        </div>

        {doctors.length > 0 ? (
          <DoctorList initialDoctors={doctors} />
        ) : (
          <div className="text-center py-12 bg-red-50 text-red-600 rounded-xl border border-red-100">
            <p className="font-medium text-lg">No data found.</p>
            <p className="text-sm mt-2">Please ensure your Google Sheet has data and the column headers match.</p>
          </div>
        )}
      </div>
    </main>
  );
}
