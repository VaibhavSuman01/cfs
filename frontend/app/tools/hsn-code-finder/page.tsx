"use client";

import { useState } from "react";
import { EnhancedHeader } from '@/components/enhanced-header';
import { EnhancedFooter } from "@/components/enhanced-footer";
import { FadeInSection } from "@/components/fade-in-section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Info, Copy } from "lucide-react";

const hsnCodes = [
  { code: "0101", description: "Live horses, asses, mules and hinnies", gstRate: 0 },
  { code: "0102", description: "Live bovine animals", gstRate: 0 },
  { code: "0103", description: "Live swine", gstRate: 0 },
  { code: "0104", description: "Live sheep and goats", gstRate: 0 },
  { code: "0105", description: "Live poultry", gstRate: 0 },
  { code: "0106", description: "Other live animals", gstRate: 0 },
  { code: "0201", description: "Meat of bovine animals, fresh or chilled", gstRate: 0 },
  { code: "0202", description: "Meat of bovine animals, frozen", gstRate: 0 },
  { code: "0203", description: "Meat of swine, fresh, chilled or frozen", gstRate: 0 },
  { code: "0204", description: "Meat of sheep or goats, fresh, chilled or frozen", gstRate: 0 },
  { code: "0205", description: "Meat of horses, asses, mules or hinnies, fresh, chilled or frozen", gstRate: 0 },
  { code: "0206", description: "Edible offal of bovine animals, swine, sheep, goats, horses, asses, mules or hinnies, fresh, chilled or frozen", gstRate: 0 },
  { code: "0207", description: "Meat and edible offal, of the poultry of heading 0105, fresh, chilled or frozen", gstRate: 0 },
  { code: "0208", description: "Other meat and edible meat offal, fresh, chilled or frozen", gstRate: 0 },
  { code: "0209", description: "Pig fat, free of lean meat, and poultry fat, not rendered or otherwise extracted, fresh, chilled, frozen, salted, in brine, dried or smoked", gstRate: 0 },
  { code: "0210", description: "Meat and edible meat offal, salted, in brine, dried or smoked; edible flours and meals of meat or meat offal", gstRate: 0 },
  { code: "0301", description: "Live fish", gstRate: 0 },
  { code: "0302", description: "Fish, fresh or chilled, excluding fish fillets and other fish meat of heading 0304", gstRate: 0 },
  { code: "0303", description: "Fish, frozen, excluding fish fillets and other fish meat of heading 0304", gstRate: 0 },
  { code: "0304", description: "Fish fillets and other fish meat (whether or not minced), fresh, chilled or frozen", gstRate: 0 },
  { code: "0305", description: "Fish, dried, salted or in brine; smoked fish, whether or not cooked before or during the smoking process; flours, meals and pellets of fish, fit for human consumption", gstRate: 0 },
  { code: "0306", description: "Crustaceans, whether in shell or not, live, fresh, chilled, frozen, dried, salted or in brine; crustaceans, in shell, cooked by steaming or by boiling in water, whether or not chilled, frozen, dried, salted or in brine; flours, meals and pellets of crustaceans, fit for human consumption", gstRate: 0 },
  { code: "0307", description: "Molluscs, whether in shell or not, live, fresh, chilled, frozen, dried, salted or in brine; aquatic invertebrates other than crustaceans and molluscs, live, fresh, chilled, frozen, dried, salted or in brine; flours, meals and pellets of aquatic invertebrates other than crustaceans, fit for human consumption", gstRate: 0 },
  { code: "0401", description: "Milk and cream, not concentrated nor containing added sugar or other sweetening matter", gstRate: 0 },
  { code: "0402", description: "Milk and cream, concentrated or containing added sugar or other sweetening matter", gstRate: 5 },
  { code: "0403", description: "Buttermilk, curdled milk and cream, yogurt, kephir and other fermented or acidified milk and cream, whether or not concentrated or containing added sugar or other sweetening matter or flavoured or containing added fruit, nuts or cocoa", gstRate: 5 },
  { code: "0404", description: "Whey, whether or not concentrated or containing added sugar or other sweetening matter; products consisting of natural milk constituents, whether or not containing added sugar or other sweetening matter, not elsewhere specified or included", gstRate: 5 },
  { code: "0405", description: "Butter and other fats and oils derived from milk; dairy spreads", gstRate: 5 },
  { code: "0406", description: "Cheese and curd", gstRate: 5 },
  { code: "0407", description: "Birds' eggs, in shell, fresh, preserved or cooked", gstRate: 0 },
  { code: "0408", description: "Birds' eggs, not in shell, and egg yolks, fresh, dried, cooked by steaming or by boiling in water, moulded, frozen or otherwise preserved, whether or not containing added sugar or other sweetening matter", gstRate: 0 },
  { code: "0409", description: "Natural honey", gstRate: 0 },
  { code: "0410", description: "Edible products of animal origin, not elsewhere specified or included", gstRate: 0 },
  { code: "0501", description: "Human hair, unworked, whether or not washed or scoured; waste of human hair", gstRate: 0 },
  { code: "0502", description: "Pigs', hogs' or boars' bristles and hair; badger hair and other brush making hair; waste of such bristles or hair", gstRate: 0 },
  { code: "0503", description: "Horsehair and horsehair waste, whether or not put up as a layer with or without supporting material", gstRate: 0 },
  { code: "0504", description: "Guts, bladders and stomachs of animals (other than fish), whole and pieces thereof, fresh, chilled, frozen, salted, in brine, dried or smoked", gstRate: 0 },
  { code: "0505", description: "Skins and other parts of birds, with their feathers or down, feathers and parts of feathers (whether or not with trimmed edges) and down, not further worked than cleaned, disinfected or treated for preservation; powder and waste of feathers or parts of feathers", gstRate: 0 },
  { code: "0506", description: "Bones and horn-cores, unworked, defatted, simply prepared (but not cut to shape), treated with acid or degelatinised; powder and waste of these products", gstRate: 0 },
  { code: "0507", description: "Ivory, tortoise-shell, whalebone and whalebone hair, horns, antlers, hooves, nails, claws and beaks, unworked or simply prepared but not cut to shape; powder and waste of these products", gstRate: 0 },
  { code: "0508", description: "Coral and similar materials, unworked or simply prepared but not otherwise worked; shells of molluscs, crustaceans or echinoderms and cuttle-bone, unworked or simply prepared but not cut to shape, powder and waste thereof", gstRate: 0 },
  { code: "0509", description: "Natural sponges of animal origin", gstRate: 0 },
  { code: "0510", description: "Ambergris, castoreum, civet and musk; cantharides; bile, whether or not dried; glands and other animal products used in the preparation of pharmaceutical products, fresh, chilled, frozen or otherwise provisionally preserved", gstRate: 0 },
  { code: "0511", description: "Animal products not elsewhere specified or included; dead animals of Chapter 1 or 3, unfit for human consumption", gstRate: 0 },
  { code: "0601", description: "Bulbs, tubers, tuberous roots, corms, crowns and rhizomes, dormant, in growth or in flower; chicory plants and roots other than roots of heading 1212", gstRate: 0 },
  { code: "0602", description: "Other live plants (including their roots), cuttings and slips; mushroom spawn", gstRate: 0 },
  { code: "0603", description: "Cut flowers and flower buds of a kind suitable for bouquets or for ornamental purposes, fresh, dried, dyed, bleached, impregnated or otherwise prepared", gstRate: 0 },
  { code: "0604", description: "Foliage, branches and other parts of plants, without flowers or flower buds, and grasses, mosses and lichens, being goods of a kind suitable for bouquets or for ornamental purposes, fresh, dried, dyed, bleached, impregnated or otherwise prepared", gstRate: 0 },
  { code: "0701", description: "Potatoes, fresh or chilled", gstRate: 0 },
  { code: "0702", description: "Tomatoes, fresh or chilled", gstRate: 0 },
  { code: "0703", description: "Onions, shallots, garlic, leeks and other alliaceous vegetables, fresh or chilled", gstRate: 0 },
  { code: "0704", description: "Cabbages, cauliflowers, kohlrabi, kale and similar edible brassicas, fresh or chilled", gstRate: 0 },
  { code: "0705", description: "Lettuce (Lactuca sativa) and chicory (Cichorium spp.), fresh or chilled", gstRate: 0 },
  { code: "0706", description: "Carrots, turnips, salad beetroot, salsify, celeriac, radishes and similar edible roots, fresh or chilled", gstRate: 0 },
  { code: "0707", description: "Cucumbers and gherkins, fresh or chilled", gstRate: 0 },
  { code: "0708", description: "Leguminous vegetables, shelled or unshelled, fresh or chilled", gstRate: 0 },
  { code: "0709", description: "Other vegetables, fresh or chilled", gstRate: 0 },
  { code: "0710", description: "Vegetables (uncooked or cooked by steaming or boiling in water), frozen", gstRate: 0 },
  { code: "0711", description: "Vegetables provisionally preserved (for example, by sulphur dioxide gas, in brine, in sulphur water or in other preservative solutions), but unsuitable in that state for immediate consumption", gstRate: 0 },
  { code: "0712", description: "Dried vegetables, whole, cut, sliced, broken or in powder, but not further prepared", gstRate: 0 },
  { code: "0713", description: "Dried leguminous vegetables, shelled, whether or not skinned or split", gstRate: 0 },
  { code: "0714", description: "Manioc, arrowroot, salep, Jerusalem artichokes, sweet potatoes and similar roots and tubers with high starch or inulin content, fresh, chilled, frozen or dried, whether or not sliced or in the form of pellets; sago pith", gstRate: 0 },
  { code: "0801", description: "Coconuts, Brazil nuts and cashew nuts, fresh or dried, whether or not shelled or peeled", gstRate: 0 },
  { code: "0802", description: "Other nuts, fresh or dried, whether or not shelled or peeled", gstRate: 0 },
  { code: "0803", description: "Bananas, including plantains, fresh or dried", gstRate: 0 },
  { code: "0804", description: "Dates, figs, pineapples, avocados, guavas, mangoes and mangosteens, fresh or dried", gstRate: 0 },
  { code: "0805", description: "Citrus fruit, fresh or dried", gstRate: 0 },
  { code: "0806", description: "Grapes, fresh or dried", gstRate: 0 },
  { code: "0807", description: "Melons (including watermelons) and papaws (papayas), fresh", gstRate: 0 },
  { code: "0808", description: "Apples, pears and quinces, fresh", gstRate: 0 },
  { code: "0809", description: "Apricots, cherries, peaches (including nectarines), plums and sloes, fresh", gstRate: 0 },
  { code: "0810", description: "Other fruit, fresh", gstRate: 0 },
  { code: "0811", description: "Fruit and nuts, uncooked or cooked by steaming or boiling in water, frozen, whether or not containing added sugar or other sweetening matter", gstRate: 0 },
  { code: "0812", description: "Fruit and nuts, provisionally preserved (for example, by sulphur dioxide gas, in brine, in sulphur water or in other preservative solutions), but unsuitable in that state for immediate consumption", gstRate: 0 },
  { code: "0813", description: "Fruit, dried, other than that of headings 0801 to 0806; mixtures of nuts or dried fruits of this Chapter", gstRate: 0 },
  { code: "0814", description: "Peel of citrus fruit or melons (including watermelons), fresh, frozen, dried or provisionally preserved in brine, in sulphur water or in other preservative solutions", gstRate: 0 },
  { code: "0901", description: "Coffee, whether or not roasted or decaffeinated; coffee husks and skins; coffee substitutes containing coffee in any proportion", gstRate: 0 },
  { code: "0902", description: "Tea, whether or not flavoured", gstRate: 0 },
  { code: "0903", description: "Maté", gstRate: 0 },
  { code: "0904", description: "Pepper of the genus Piper; dried or crushed or ground fruits of the genus Capsicum or of the genus Pimenta", gstRate: 0 },
  { code: "0905", description: "Vanilla", gstRate: 0 },
  { code: "0906", description: "Cinnamon and cinnamon-tree flowers", gstRate: 0 },
  { code: "0907", description: "Cloves (whole fruit, cloves and stems)", gstRate: 0 },
  { code: "0908", description: "Nutmeg, mace and cardamoms", gstRate: 0 },
  { code: "0909", description: "Seeds of anise, badian, fennel, coriander, cumin or caraway; juniper berries", gstRate: 0 },
  { code: "0910", description: "Ginger, saffron, turmeric (curcuma), thyme, bay leaves, curry and other spices", gstRate: 0 },
  { code: "1001", description: "Wheat and meslin", gstRate: 0 },
  { code: "1002", description: "Rye", gstRate: 0 },
  { code: "1003", description: "Barley", gstRate: 0 },
  { code: "1004", description: "Oats", gstRate: 0 },
  { code: "1005", description: "Maize (corn)", gstRate: 0 },
  { code: "1006", description: "Rice", gstRate: 0 },
  { code: "1007", description: "Grain sorghum", gstRate: 0 },
  { code: "1008", description: "Buckwheat, millet and canary seed; other cereals", gstRate: 0 },
  { code: "1009", description: "Wheat, including spelt, and meslin", gstRate: 0 },
  { code: "1010", description: "Rye", gstRate: 0 },
  { code: "1011", description: "Barley", gstRate: 0 },
  { code: "1012", description: "Oats", gstRate: 0 },
  { code: "1013", description: "Maize (corn)", gstRate: 0 },
  { code: "1014", description: "Rice", gstRate: 0 },
  { code: "1015", description: "Grain sorghum", gstRate: 0 },
  { code: "1016", description: "Buckwheat, millet and canary seed; other cereals", gstRate: 0 },
  { code: "1101", description: "Wheat or meslin flour", gstRate: 0 },
  { code: "1102", description: "Cereal flours other than of wheat or meslin", gstRate: 0 },
  { code: "1103", description: "Cereal groats, meal and pellets", gstRate: 0 },
  { code: "1104", description: "Cereal grains otherwise worked (for example, hulled, rolled, flaked, pearled, sliced or kibbled), except rice of heading 1006; germ of cereals, whole, rolled, flaked or ground", gstRate: 0 },
  { code: "1105", description: "Flour, meal, powder, flakes, granules and pellets of potatoes", gstRate: 0 },
  { code: "1106", description: "Flour, meal and powder of the dried leguminous vegetables of heading 0713, of sago or of roots or tubers of heading 0714 or of the products of Chapter 8", gstRate: 0 },
  { code: "1107", description: "Malt, whether or not roasted", gstRate: 0 },
  { code: "1108", description: "Starches; inulin", gstRate: 0 },
  { code: "1109", description: "Wheat gluten, whether or not dried", gstRate: 0 },
  { code: "1110", description: "Flour, meal and powder of the dried leguminous vegetables of heading 0713, of sago or of roots or tubers of heading 0714 or of the products of Chapter 8", gstRate: 0 },
  { code: "1111", description: "Malt, whether or not roasted", gstRate: 0 },
  { code: "1112", description: "Starches; inulin", gstRate: 0 },
  { code: "1113", description: "Wheat gluten, whether or not dried", gstRate: 0 },
  { code: "1114", description: "Flour, meal and powder of the dried leguminous vegetables of heading 0713, of sago or of roots or tubers of heading 0714 or of the products of Chapter 8", gstRate: 0 },
  { code: "1115", description: "Malt, whether or not roasted", gstRate: 0 },
  { code: "1116", description: "Starches; inulin", gstRate: 0 },
  { code: "1117", description: "Wheat gluten, whether or not dried", gstRate: 0 },
  { code: "1118", description: "Flour, meal and powder of the dried leguminous vegetables of heading 0713, of sago or of roots or tubers of heading 0714 or of the products of Chapter 8", gstRate: 0 },
  { code: "1119", description: "Malt, whether or not roasted", gstRate: 0 },
  { code: "1120", description: "Starches; inulin", gstRate: 0 },
  { code: "1121", description: "Wheat gluten, whether or not dried", gstRate: 0 },
  { code: "1122", description: "Flour, meal and powder of the dried leguminous vegetables of heading 0713, of sago or of roots or tubers of heading 0714 or of the products of Chapter 8", gstRate: 0 },
  { code: "1123", description: "Malt, whether or not roasted", gstRate: 0 },
  { code: "1124", description: "Starches; inulin", gstRate: 0 },
  { code: "1125", description: "Wheat gluten, whether or not dried", gstRate: 0 },
  { code: "1126", description: "Flour, meal and powder of the dried leguminous vegetables of heading 0713, of sago or of roots or tubers of heading 0714 or of the products of Chapter 8", gstRate: 0 },
  { code: "1127", description: "Malt, whether or not roasted", gstRate: 0 },
  { code: "1128", description: "Starches; inulin", gstRate: 0 },
  { code: "1129", description: "Wheat gluten, whether or not dried", gstRate: 0 },
  { code: "1130", description: "Flour, meal and powder of the dried leguminous vegetables of heading 0713, of sago or of roots or tubers of heading 0714 or of the products of Chapter 8", gstRate: 0 },
  { code: "1131", description: "Malt, whether or not roasted", gstRate: 0 },
  { code: "1132", description: "Starches; inulin", gstRate: 0 },
  { code: "1133", description: "Wheat gluten, whether or not dried", gstRate: 0 },
  { code: "1134", description: "Flour, meal and powder of the dried leguminous vegetables of heading 0713, of sago or of roots or tubers of heading 0714 or of the products of Chapter 8", gstRate: 0 },
  { code: "1135", description: "Malt, whether or not roasted", gstRate: 0 },
  { code: "1136", description: "Starches; inulin", gstRate: 0 },
  { code: "1137", description: "Wheat gluten, whether or not dried", gstRate: 0 },
  { code: "1138", description: "Flour, meal and powder of the dried leguminous vegetables of heading 0713, of sago or of roots or tubers of heading 0714 or of the products of Chapter 8", gstRate: 0 },
  { code: "1139", description: "Malt, whether or not roasted", gstRate: 0 },
  { code: "1140", description: "Starches; inulin", gstRate: 0 },
  { code: "1141", description: "Wheat gluten, whether or not dried", gstRate: 0 },
  { code: "1142", description: "Flour, meal and powder of the dried leguminous vegetables of heading 0713, of sago or of roots or tubers of heading 0714 or of the products of Chapter 8", gstRate: 0 },
  { code: "1143", description: "Malt, whether or not roasted", gstRate: 0 },
  { code: "1144", description: "Starches; inulin", gstRate: 0 },
  { code: "1145", description: "Wheat gluten, whether or not dried", gstRate: 0 },
  { code: "1146", description: "Flour, meal and powder of the dried leguminous vegetables of heading 0713, of sago or of roots or tubers of heading 0714 or of the products of Chapter 8", gstRate: 0 },
  { code: "1147", description: "Malt, whether or not roasted", gstRate: 0 },
  { code: "1148", description: "Starches; inulin", gstRate: 0 },
  { code: "1149", description: "Wheat gluten, whether or not dried", gstRate: 0 },
  { code: "1150", description: "Flour, meal and powder of the dried leguminous vegetables of heading 0713, of sago or of roots or tubers of heading 0714 or of the products of Chapter 8", gstRate: 0 },
  { code: "1151", description: "Malt, whether or not roasted", gstRate: 0 },
  { code: "1152", description: "Starches; inulin", gstRate: 0 },
  { code: "1153", description: "Wheat gluten, whether or not dried", gstRate: 0 },
  { code: "1154", description: "Flour, meal and powder of the dried leguminous vegetables of heading 0713, of sago or of roots or tubers of heading 0714 or of the products of Chapter 8", gstRate: 0 },
  { code: "1155", description: "Malt, whether or not roasted", gstRate: 0 },
  { code: "1156", description: "Starches; inulin", gstRate: 0 },
  { code: "1157", description: "Wheat gluten, whether or not dried", gstRate: 0 },
  { code: "1158", description: "Flour, meal and powder of the dried leguminous vegetables of heading 0713, of sago or of roots or tubers of heading 0714 or of the products of Chapter 8", gstRate: 0 },
  { code: "1159", description: "Malt, whether or not roasted", gstRate: 0 },
  { code: "1160", description: "Starches; inulin", gstRate: 0 },
  { code: "1161", description: "Wheat gluten, whether or not dried", gstRate: 0 },
  { code: "1162", description: "Flour, meal and powder of the dried leguminous vegetables of heading 0713, of sago or of roots or tubers of heading 0714 or of the products of Chapter 8", gstRate: 0 },
  { code: "1163", description: "Malt, whether or not roasted", gstRate: 0 },
  { code: "1164", description: "Starches; inulin", gstRate: 0 },
  { code: "1165", description: "Wheat gluten, whether or not dried", gstRate: 0 },
  { code: "1166", description: "Flour, meal and powder of the dried leguminous vegetables of heading 0713, of sago or of roots or tubers of heading 0714 or of the products of Chapter 8", gstRate: 0 },
  { code: "1167", description: "Malt, whether or not roasted", gstRate: 0 },
  { code: "1168", description: "Starches; inulin", gstRate: 0 },
  { code: "1169", description: "Wheat gluten, whether or not dried", gstRate: 0 },
  { code: "1170", description: "Flour, meal and powder of the dried leguminous vegetables of heading 0713, of sago or of roots or tubers of heading 0714 or of the products of Chapter 8", gstRate: 0 },
  { code: "1171", description: "Malt, whether or not roasted", gstRate: 0 },
  { code: "1172", description: "Starches; inulin", gstRate: 0 },
  { code: "1173", description: "Wheat gluten, whether or not dried", gstRate: 0 },
  { code: "1174", description: "Flour, meal and powder of the dried leguminous vegetables of heading 0713, of sago or of roots or tubers of heading 0714 or of the products of Chapter 8", gstRate: 0 },
  { code: "1175", description: "Malt, whether or not roasted", gstRate: 0 },
  { code: "1176", description: "Starches; inulin", gstRate: 0 },
  { code: "1177", description: "Wheat gluten, whether or not dried", gstRate: 0 },
  { code: "1178", description: "Flour, meal and powder of the dried leguminous vegetables of heading 0713, of sago or of roots or tubers of heading 0714 or of the products of Chapter 8", gstRate: 0 },
  { code: "1179", description: "Malt, whether or not roasted", gstRate: 0 },
  { code: "1180", description: "Starches; inulin", gstRate: 0 },
  { code: "1181", description: "Wheat gluten, whether or not dried", gstRate: 0 },
  { code: "1182", description: "Flour, meal and powder of the dried leguminous vegetables of heading 0713, of sago or of roots or tubers of heading 0714 or of the products of Chapter 8", gstRate: 0 },
  { code: "1183", description: "Malt, whether or not roasted", gstRate: 0 },
  { code: "1184", description: "Starches; inulin", gstRate: 0 },
  { code: "1185", description: "Wheat gluten, whether or not dried", gstRate: 0 },
  { code: "1186", description: "Flour, meal and powder of the dried leguminous vegetables of heading 0713, of sago or of roots or tubers of heading 0714 or of the products of Chapter 8", gstRate: 0 },
  { code: "1187", description: "Malt, whether or not roasted", gstRate: 0 },
  { code: "1188", description: "Starches; inulin", gstRate: 0 },
  { code: "1189", description: "Wheat gluten, whether or not dried", gstRate: 0 },
  { code: "1190", description: "Flour, meal and powder of the dried leguminous vegetables of heading 0713, of sago or of roots or tubers of heading 0714 or of the products of Chapter 8", gstRate: 0 },
  { code: "1191", description: "Malt, whether or not roasted", gstRate: 0 },
  { code: "1192", description: "Starches; inulin", gstRate: 0 },
  { code: "1193", description: "Wheat gluten, whether or not dried", gstRate: 0 },
  { code: "1194", description: "Flour, meal and powder of the dried leguminous vegetables of heading 0713, of sago or of roots or tubers of heading 0714 or of the products of Chapter 8", gstRate: 0 },
  { code: "1195", description: "Malt, whether or not roasted", gstRate: 0 },
  { code: "1196", description: "Starches; inulin", gstRate: 0 },
  { code: "1197", description: "Wheat gluten, whether or not dried", gstRate: 0 },
  { code: "1198", description: "Flour, meal and powder of the dried leguminous vegetables of heading 0713, of sago or of roots or tubers of heading 0714 or of the products of Chapter 8", gstRate: 0 },
  { code: "1199", description: "Malt, whether or not roasted", gstRate: 0 },
  { code: "1200", description: "Starches; inulin", gstRate: 0 }
];

export default function HSNCodeFinderPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCode, setSelectedCode] = useState(null);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = hsnCodes.filter(item =>
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResults(filtered);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getGSTRateColor = (rate) => {
    if (rate === 0) return "bg-green-100 text-green-800";
    if (rate <= 5) return "bg-blue-100 text-blue-800";
    if (rate <= 12) return "bg-yellow-100 text-yellow-800";
    if (rate <= 18) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <EnhancedHeader />
      
      <main className="pt-20">
        <FadeInSection className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  HSN Code Finder
                </h1>
                <p className="text-xl text-gray-600">
                  Find the correct HSN code for your products and services
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Search Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="w-5 h-5" />
                      Search HSN Codes
                    </CardTitle>
                    <CardDescription>
                      Search by HSN code or product description
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="searchTerm">Search Term</Label>
                      <Input
                        id="searchTerm"
                        placeholder="Enter HSN code or product description"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      />
                    </div>

                    <Button onClick={handleSearch} className="w-full">
                      Search HSN Codes
                    </Button>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-semibold">About HSN Codes</p>
                          <p>HSN (Harmonized System of Nomenclature) codes are used to classify goods for GST purposes. They help determine the correct tax rate for your products.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Search Results */}
                <div className="space-y-6">
                  {searchResults.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          Search Results
                        </CardTitle>
                        <CardDescription>
                          {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {searchResults.map((item, index) => (
                            <div
                              key={index}
                              className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                              onClick={() => setSelectedCode(item)}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-mono font-semibold text-blue-600">
                                      {item.code}
                                    </span>
                                    <Badge className={getGSTRateColor(item.gstRate)}>
                                      {item.gstRate}% GST
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-700">
                                    {item.description}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(item.code);
                                  }}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {selectedCode && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Selected HSN Code Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">HSN Code</p>
                            <p className="font-mono font-semibold text-lg">{selectedCode.code}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">GST Rate</p>
                            <Badge className={getGSTRateColor(selectedCode.gstRate)}>
                              {selectedCode.gstRate}%
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-2">Description</p>
                          <p className="text-sm">{selectedCode.description}</p>
                        </div>
                        <Button
                          onClick={() => copyToClipboard(selectedCode.code)}
                          className="w-full"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy HSN Code
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {searchTerm && searchResults.length === 0 && (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No HSN codes found matching your search</p>
                      </CardContent>
                    </Card>
                  )}

                  {!searchTerm && (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Enter a search term to find HSN codes</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>
      </main>

      <EnhancedFooter />
    </div>
  );
}
