import PublicNavbar from "@/components/layout/PublicNavbar";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <>
      <PublicNavbar />
      <main className="min-h-screen bg-gray-50 text-gray-600 py-8">
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
          <h1 className="text-4xl font-bold">À propos d’AMPUNV</h1>
          <h2 className="text-xl font-semibold">
            Ancien Meuble Pour Une Nouvelle Vie
          </h2>

          <p>
            Bienvenue sur <strong>AMPUNV</strong>, une plateforme pensée pour
            redonner une seconde vie aux meubles qui nous accompagnent parfois
            depuis des années. Ici, nous croyons que chaque objet a une histoire
            à raconter et qu’il mérite une nouvelle chance entre des mains qui
            sauront l’apprécier.
          </p>

          <p>
            L’application a été fondée par <strong>Lauréline</strong>,
            passionnée par la rénovation, le réemploi et surtout par l’idée que
            les meubles ont une âme. Face au gaspillage grandissant et aux
            objets jetés trop vite, elle a imaginé un espace simple, moderne et
            accessible où chacun peut vendre, acheter ou transmettre un meuble
            pour lui offrir une continuité.
          </p>

          <h3 className="text-2xl font-semibold">Notre mission</h3>
          <p>
            AMPUNV a pour objectif de créer un{" "}
            <strong>pont entre particuliers</strong>, en facilitant l’achat et
            la vente de meubles d’occasion. Que vous soyez à la recherche d’un
            bureau vintage, d’un buffet chiné ou d’une table à restaurer, vous
            pourrez trouver ici de véritables pépites prêtes à vivre une
            nouvelle histoire.
          </p>

          <h3 className="text-2xl font-semibold">Pourquoi AMPUNV ?</h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <strong>Donner une seconde vie aux meubles</strong> : moins de
              déchets, plus de créativité.
            </li>
            <li>
              <strong>Favoriser un mode de consommation responsable</strong> :
              acheter d’occasion, c’est faire un geste pour la planète.
            </li>
            <li>
              <strong>Créer une communauté d’amateurs de beaux objets</strong> :
              ceux qui aiment transmettre, restaurer ou chiner.
            </li>
          </ul>

          <h3 className="text-2xl font-semibold">
            Une plateforme pensée pour vous
          </h3>
          <p>Chaque fonctionnalité a été conçue pour être intuitive :</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Création d’annonce simplifiée</li>
            <li>Mise en relation directe entre particuliers</li>
            <li>Système de favoris</li>
            <li>Photos détaillées</li>
            <li>Recherche optimisée selon vos envies</li>
          </ul>

          <p>
            AMPUNV n’est pas seulement un site de petites annonces : c’est un
            lieu où l’on partage le goût du mobilier qui traverse le temps, un
            endroit où la durabilité et l’esthétique se rencontrent.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}