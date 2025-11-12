import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">AMPUNV</h3>
            <p className="text-gray-400 text-sm">
              Ancien Meuble Pour Une Nouvelle Vie.
              </p>
              <p className="text-gray-400 text-sm"> 
              La plateforme de vente de
              meubles d'occasion entre particuliers.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white text-sm transition"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog"
                  className="text-gray-400 hover:text-white text-sm transition"
                >
                  Catalogue
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white text-sm transition"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-gray-400 hover:text-white text-sm transition"
                >
                  Devenir vendeur
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>contact@ampunv.fr</li>
              <li>+33 X XX XX XX XX</li>
              <li>Nantes, France</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} AMPUNV. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}