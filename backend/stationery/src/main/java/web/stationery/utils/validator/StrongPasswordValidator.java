//package web.stationery.utils.validator;
//
//import jakarta.validation.ConstraintValidator;
//import jakarta.validation.ConstraintValidatorContext;
//import org.passay.*;
//
//public class StrongPasswordValidator implements ConstraintValidator<StrongPassword, String> {
//    @Override
//    public boolean isValid(String password, ConstraintValidatorContext context) {
//        PasswordValidator validator = new PasswordValidator(Arrays.asList(
//                new LengthRule(8, 30), // Độ dài từ 8-30 ký tự
//                new UppercaseCharacterRule(1), // Ít nhất 1 chữ hoa
//                new LowercaseCharacterRule(1), // Ít nhất 1 chữ thường
//                new DigitCharacterRule(1), // Ít nhất 1 số
//                new SpecialCharacterRule(1), // Ít nhất 1 ký tự đặc biệt
//                new WhitespaceRule() // Không chứa khoảng trắng
//        ));
//
//        RuleResult result = validator.validate(new PasswordData(password));
//        return result.isValid();
//    }
//}