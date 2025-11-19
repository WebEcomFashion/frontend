import Title from "../components/Title";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            NOLabel
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light">
            Where identity transcends definition
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <Title text1={"OUR"} text2={"STORY"} />
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">
              Born from rebellion, refined by purpose
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                NOLabel was founded in 2024 with a simple yet powerful vision:
                to create clothing that speaks without words, that defines
                without confining.
              </p>
              <p>
                In a world obsessed with labels and categories, we saw an
                opportunity to break free. Our journey began in a small studio,
                where sketches turned into patterns, and patterns into a
                movement.
              </p>
              <p>
                Every piece we create is a statement against conformity, a
                celebration of individuality, and a commitment to timeless
                design that transcends fleeting trends.
              </p>
            </div>
          </div>
          <div className="bg-gray-100 aspect-square flex items-center justify-center">
            <span className="text-6xl font-bold text-gray-300">NO</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div className="bg-gray-900 aspect-square flex items-center justify-center order-2 md:order-1">
            <span className="text-6xl font-bold text-white">LABEL</span>
          </div>
          <div className="order-1 md:order-2">
            <Title text1={"THE"} text2={"FOUNDER"} />
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">
              Vision meets craft
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Founded by a collective of designers and artists who refused to
                be boxed in by traditional fashion norms, NOLabel represents a
                new generation of creative expression.
              </p>
              <p>
                Our founder's background in minimalist architecture and
                contemporary art heavily influences every collection, resulting
                in pieces that are as much art as they are apparel.
              </p>
              <p>
                "We don't create clothes for people to fit into. We create
                clothes that fit into people's lives, their stories, their
                identities."
              </p>
            </div>
          </div>
        </div>

        <div className="bg-black text-white p-12 md:p-16">
          <div className="max-w-3xl mx-auto">
            <Title text1={"BRAND"} text2={"PHILOSOPHY"} />
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Design without boundaries
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div>
                <h3 className="text-xl font-bold mb-3">Minimalism</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Less is more. Every stitch, every seam, every detail serves a
                  purpose. We eliminate the unnecessary to highlight the
                  essential.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">Quality</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Premium materials, ethical production, timeless construction.
                  Our pieces are designed to last seasons, not just a season.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">Identity</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Fashion is personal. We create canvases for self-expression,
                  not uniforms for conformity. Your style, your story.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="py-20">
          <div className="text-center mb-12">
            <Title text1={"OUR"} text2={"VALUES"} />
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              What we stand for
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                01
              </div>
              <h3 className="font-bold text-lg mb-2">Sustainability</h3>
              <p className="text-gray-600 text-sm">
                Eco-conscious materials and ethical manufacturing practices
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                02
              </div>
              <h3 className="font-bold text-lg mb-2">Inclusivity</h3>
              <p className="text-gray-600 text-sm">
                Fashion for everyone, regardless of size, gender, or background
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                03
              </div>
              <h3 className="font-bold text-lg mb-2">Innovation</h3>
              <p className="text-gray-600 text-sm">
                Pushing boundaries with cutting-edge design and technology
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                04
              </div>
              <h3 className="font-bold text-lg mb-2">Authenticity</h3>
              <p className="text-gray-600 text-sm">
                Real stories, real people, real impact in everything we do
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
