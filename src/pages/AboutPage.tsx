
import { Users, Award, History, Sparkles } from 'lucide-react';
import { Separator } from '@/components/ui/separator';


const AboutPage = () => {
  return (
    <div className="section-container">
      <h1 className="page-title">About Lingam Aabharanam</h1>
      <p className="section-subtitle max-w-3xl">
        Discover the story behind our dedication to crafting exquisite silver jewelry and idols.
      </p>

      {/* Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-medium">Our Heritage</h2>
          <p className="text-gray-700">
          Established in 2022 by Netra and Anil Lingam, Lingam Aabharanam is dedicated to creating high-quality silver articles and jewelry that blend timeless tradition with modern design. We specialize in 925 and 999 certified silver products—from pooja items and god idols to designer jewelry and customized gifts.
          </p>
          <p className="text-gray-700">
          Our journey began with a small, curated collection, and today, we’ve successfully fulfilled over 1000+ orders across the U.S, Canada and India. Our loyal customer base values the uniqueness, authenticity, and craftsmanship we bring to every piece.
          </p>
          <p className="text-gray-700">
            We believe in offering more than just products—we create heirlooms. With customization at the heart of our service, we make silver personal, meaningful, and elegant.Join us as we continue to expand, innovate, and bring tradition to life—one silver piece at a time.
          </p>
        </div>

        <div className="relative">
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-brand-gold/20 rounded-full -z-10"></div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand-red/10 rounded-full -z-10"></div>
          <img
            src="https://media-hosting.imagekit.io/84a1b569078540a9/Screenshot%202025-04-24%20024442.png?Expires=1840050924&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=guHwl-RqRILoIc5aAOUR79LhfiRVm2uW17QWzhmDxLenCpXlOZ0SfTfIKyuyt2qzQ6a3d4InSAukrOwuiRFHUp5uydG8MnApm1RSrUfHhTwuhL5MZuQ4iknMDgMjtEMBpgZ1PGU7CnPf3hqwuYnbTkI2WtMj7S3-~QhCePRihZxVyiZi51lQ4otTdsDVWmBa2qy-~I9G~~Lsz7g08YwdtOdHBxbU1J-6VEgYpEHtT~kio5TNyU-AjwZQ80terSlkEbu8ZyZ72DQMP~ohgw0UcOSbsMcTWTPKAUZstrxG4JXvq-eg7wxQq36FCdq1uEdKdNqTUDBsVKUoqCfJyf6g~w__" 
            alt="Silver craftsmanship" 
            className="w-full h-full rounded-lg object-cover shadow-xl"
          />
        </div>
      </div>
      
      {/* Core Values */}
      <div className="mb-16">
        <h2 className="text-2xl font-serif font-medium mb-8">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-brand-gold/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Award className="text-brand-gold h-6 w-6" />
            </div>
            <h3 className="font-serif text-lg font-medium mb-2">Quality Craftsmanship</h3>
            <p className="text-gray-700">
              We believe in creating pieces that stand the test of time, both in design and durability.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-brand-gold/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <History className="text-brand-gold h-6 w-6" />
            </div>
            <h3 className="font-serif text-lg font-medium mb-2">Cultural Heritage</h3>
            <p className="text-gray-700">
              Preserving traditional designs and techniques while bringing them into the modern context.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-brand-gold/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="text-brand-gold h-6 w-6" />
            </div>
            <h3 className="font-serif text-lg font-medium mb-2">Authenticity</h3>
            <p className="text-gray-700">
              Using only genuine materials and providing certification for all our silver products.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-brand-gold/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Users className="text-brand-gold h-6 w-6" />
            </div>
            <h3 className="font-serif text-lg font-medium mb-2">Community Support</h3>
            <p className="text-gray-700">
              Empowering local artisans and supporting their families through fair wages and training.
            </p>
          </div>
        </div>
      </div>
      
      {/* Craftsmanship Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-serif font-medium mb-4">Our Craftsmanship</h2>
        <p className="text-gray-700 mb-8 max-w-3xl">
          At Lingam Aabharanam, each piece undergoes a meticulous creation process that combines traditional techniques with modern precision.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="rounded-lg overflow-hidden h-48">
              <img
                src="https://media-hosting.imagekit.io/531802dab73248f9/Silver%20design.png?Expires=1840051468&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=tD1oCyvyf~-v4SDrlQOM055emFQdA2x7S5XLWfgzm499m9mF6K7AJAl6eSMLI0whoQygEy3YTzOgDutVCdq-e3stSYOmek~WfNL17L5h0OfsUeGWMcAoc6bLECLYaN56MLqomhadz5eq9wpKJq9FY1leqBoR1QMBPgZfcVMFvb1ij5uEFwsRIbnJBAgntsC2pGr3GlxZq1xwMS5s~c3NRRlgx7N4yG~Edd3-EbmWYtFaUDcr7~CAYJwWkU8Jb9ncnKbs0N3FpFY8-mASYz~-kHR4Jj-G1FY4O2RWLdLapUIBSLAtygTJydi6JLJj-VqVkbHH5yrCowhUbVpdagX0gw__"
                alt="Design Process" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-serif text-lg font-medium">Design</h3>
            <p className="text-gray-700 text-sm">
              Our design process begins with hand-drawn sketches inspired by classical motifs and contemporary trends.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg overflow-hidden h-48">
              <img
                src="https://media-hosting.imagekit.io/7faa9a4929c64c48/Silver%20crafting.png?Expires=1840050487&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=2Yejwk6HtrK4ESmsxI0H3xQ91OSGoDLKcY4-282h0pHq~kNazCzDig0JYnEc1vLdyuRslGy3JtQMf6eRU2IyHnoRkEYOUsg548BnSQV8uB1uRo1V5XksuyDTh4mRygPzRap14wlNUpOo8Jw2SLSXEDnSen5DfCdgtR4g9sDpcHUXDIZrpDrpZMbHCa3BcKmmIZ3QoE4O9bJxOyvRUFjW5bV2YnNCnys9HQES-ehm6nuPPVey2xUXEuR9ANaa5GfRrq8Y~y7jIJaZthFc7jhpjjVRT5BGOdj4mI6TdBh5o-E9JY6TYpAEV3iURaa8L9fJSNhCVQn00WAE82oBCplpdA__" 
                alt="Crafting Process" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-serif text-lg font-medium">Crafting</h3>
            <p className="text-gray-700 text-sm">
              Skilled artisans transform raw silver into intricate pieces using techniques like filigree, engraving, and stone-setting.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg overflow-hidden h-48">
              <img
                src="https://media-hosting.imagekit.io/402c55210efa4d67/Quality%20Check.png?Expires=1840049825&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=epfgF5Npv2BJs-2dl8RkBKiiO9kiMPJyKHaKiGLdjSwaXVPeD3SixSwOrh-0EJ1X1NgeocbXC0r4lqumOYh-VMbYUXPN6Mwqm1iqTMdAyDsyPe2Ta2cPiZ2vn~sCez2HnVjKxYGp~Sp-jIZrtFnG21bqfjzdC0brWBXh~u0r9Vky8RKwKzfpNBlXMnwzmpdN4nDgtISGeo-8sk5-kd7vpRTxLVuwjpF4LNh1KIthcOFXEW3I5ZeC-arcBwNpI87YoYgqEVBAp-vE~ohhy2Zn989zG4pMGt9SbneG2jp3-LeSR2mHdL5tmD~ruWFkiDwFinZRPyAEv0hYFOv6oxPWgw__" 
                alt="Quality Control" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-serif text-lg font-medium">Quality Control</h3>
            <p className="text-gray-700 text-sm">
              Each piece undergoes rigorous inspection to ensure it meets our high standards of craftsmanship and durability.
            </p>
          </div>
        </div>
      </div>
      
      <Separator className="my-12" />
      
      {/* Team Section */}
      <div>
        <h2 className="text-2xl font-serif font-medium mb-4">Meet Our Team</h2>
        <p className="text-gray-700 mb-8 max-w-3xl">
          The person behind Lingam Aabharanam are passionate about preserving traditional silversmithing while embracing innovation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="rounded-full overflow-hidden h-40 w-40 mx-auto mb-4">
              <img
                src="https://media-hosting.imagekit.io/298e1c9b337a4cac/Netra%20image%20croped.jpg?Expires=1840048395&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=kUii1T8vZdlobxjpBXt8Sbt~sEuDXcQxoccRq3yVesJseIqnafACx0QPWze4yaigNtV2lC0RUH~Y5nq8yXaLoBv9AnQiPBeURGG4aYJ2zWWQ8Dtpk9evjNFZtxZ9uVn9elobDpeJlMaN4KFuKtSdpD2NnQmjPtF5zoCmUAI4~7LKGah9ORsHwu4KebRHfZo1Snhr3XBFjQwf5zArMoht7aq2YsJ91KBOZpczcBM~p4nYWMoAa-4SITZpbX1Zu-pfqBkG9dZ7QXty8GWbggixMjohskOgXBntADkvTV3T7dfwwgnDNB~Hr~OIQM04FmXA6O0F5~VamHFMl7mzIwJrZw__"
                alt="Netra Lingam" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-serif text-lg font-medium">Netra Lingam</h3>
            <p className="text-brand-gold">Founder & CEO</p>
            <p className="text-gray-700 mt-2">
              With over 3 years of experience in silver craftsmanship, Netra leads our creative vision and design philosophy.
            </p>
          </div>
          
          <div className="text-center"></div>
          <div className="text-center"></div>
          <div className="text-center"></div>
          <div className="text-center"></div>

        </div>
      </div>
    </div>
  );
};

export default AboutPage;
