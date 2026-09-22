'use client';

import { useState, useEffect } from 'react';
import { getBranches, DEFAULT_GOVERNORATES } from '../lib/api';
import { MapPin, Phone, Clock, Search, Building2 } from 'lucide-react';

export default function BranchLocator() {
  const [branches, setBranches] = useState([]);
  const [selectedGov, setSelectedGov] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getBranches(selectedGov, searchQuery).then((data) => {
      if (isMounted) {
        setBranches(data || []);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [selectedGov, searchQuery]);

  return (
    <section id="branch-locator" className="py-12 bg-white rounded-3xl border border-[#ECE1DE] max-w-[1100px] mx-auto my-8 px-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FCEEEE] border border-[#A50D1A]/20 text-[#A50D1A] text-xs font-bold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Official Network (500+ Branches)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#23161A] tracking-tight">
            Branch Directory: <span className="text-[#A50D1A]">Al Borg, Al Mokhtabar & EchoScan</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6B6B]">
            Find the nearest branch in your area to view working hours, contact numbers, and available services for IDH staff.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-[#FAF5F3] p-4 rounded-2xl border border-[#ECE1DE] space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search by area, street, or branch name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#ECE1DE] focus:border-[#A50D1A] focus:ring-1 focus:ring-[#A50D1A] outline-none bg-white text-[#23161A]"
              />
            </div>

            {/* Governorate Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              {DEFAULT_GOVERNORATES.map(gov => (
                <button
                  key={gov}
                  type="button"
                  onClick={() => setSelectedGov(gov)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    selectedGov === gov
                      ? 'bg-[#A50D1A] text-white border-[#A50D1A] shadow-sm'
                      : 'bg-white text-[#6B6B6B] border-[#ECE1DE] hover:border-[#A50D1A] hover:text-[#A50D1A]'
                  }`}
                >
                  {gov}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Branches Grid */}
        {loading ? (
          <div className="py-12 text-center text-zinc-400 text-sm">
            Loading branches...
          </div>
        ) : branches.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-sm bg-[#FAF5F3] rounded-2xl border border-[#ECE1DE]">
            No matching branches found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {branches.map(branch => (
              <div 
                key={branch.id} 
                className="bg-white p-5 rounded-2xl border border-[#ECE1DE] hover:border-[#A50D1A] hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FCEEEE] text-[#A50D1A] border border-[#A50D1A]/20">
                      {branch.providerName}
                    </span>
                    <span className="text-[11px] font-semibold text-[#6B6B6B] bg-[#FAF5F3] px-2 py-0.5 rounded-md border border-[#ECE1DE]">
                      {branch.governorate}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#23161A] mb-2 leading-tight">
                    {branch.nameEn}
                  </h3>

                  <div className="space-y-2 text-xs text-[#6B6B6B]">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#A50D1A] flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{branch.addressEn}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                      <span>{branch.hoursEn}</span>
                    </div>
                  </div>
                </div>

                {/* Branch Attributes & Contact */}
                <div className="pt-3 border-t border-[#ECE1DE] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#6B6B6B]">
                    {branch.hasHomeVisit && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-medium">
                        Home Visit
                      </span>
                    )}
                    {branch.hasParking && (
                      <span className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-md font-medium">
                        Parking
                      </span>
                    )}
                  </div>

                  <a 
                    href={`tel:${branch.phone}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF5F3] hover:bg-[#A50D1A] text-[#A50D1A] hover:text-white text-xs font-bold border border-[#ECE1DE] hover:border-[#A50D1A] transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{branch.phone}</span>
                  </a>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
