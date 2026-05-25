import PageHeader from "../../components/PageHeader";
import Container from "../../components/Container";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";

export default function FiturXyz() {
    return (
        <Container>
            <PageHeader
                title="Fitur Xyz"
                breadcrumb="Dashboard / Fitur Xyz"
            />

            <div className="mt-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">
                        Ini Halaman Fitur Xyz
                    </h2>
                    <p className="text-gray-600">
                        Halaman ini merupakan template untuk fitur Xyz
                    </p>
                </div>
            </div>

            <Card className="mt-4 w-[380px]">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Belajar shadcn/ui</CardTitle>
                        <Badge variant="secondary">Baru</Badge>
                    </div>
                    <CardDescription>
                        Contoh penggunaan komponen shadcn/ui di React
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Komponen ini dibuat di branch <strong>setup-shadcn</strong> lalu di-merge ke main.
                    </p>
                </CardContent>
                <CardFooter className="flex gap-2">
                    <Button>Simpan</Button>
                    <Button variant="outline">Batal</Button>
                </CardFooter>
            </Card>

            <div className="mt-4 flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
            </div>

            <div className="mt-4 w-[380px]">
                <Accordion type="single" collapsible defaultValue="item-1">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Apa itu shadcn/ui?</AccordionTrigger>
                        <AccordionContent>
                            shadcn/ui adalah koleksi komponen UI yang dapat di-copy paste ke project React kamu. Bukan library, tapi komponen yang bisa kamu sesuaikan sepenuhnya.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Apakah gratis?</AccordionTrigger>
                        <AccordionContent>
                            Ya, shadcn/ui sepenuhnya gratis dan open source. Kamu bisa menggunakannya untuk project pribadi maupun komersial.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Bagaimana cara install?</AccordionTrigger>
                        <AccordionContent>
                            Gunakan CLI dengan perintah <code className="bg-muted px-1 rounded">npx shadcn@latest add [component]</code> untuk menambahkan komponen yang dibutuhkan.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </Container>
    );
}
